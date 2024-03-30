import pg from 'pg';

import { UserDTO } from '@src/dto/userDTO';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { dataLogger } from '@src/utils/server/logger';

export class UserRepository implements iUserDatabase {
  public pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public async getUserBySub(sub: string): Promise<UserDTO | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM users WHERE sub = '${sub}'`
      );

      if (result.rows.length === 0) return null;
      return UserDTO.fromJSON(result.rows[0]);
    } catch (err) {
      dataLogger.error(`UserRepository.getUserBySub: ${err}`);
    } finally {
      client.release();
    }
    return null;
  }

  public async insertUser(
    client: pg.PoolClient,
    user: UserDTO
  ): Promise<UserDTO | null> {
    try {
      const result = await client.query(
        `INSERT INTO users (sub, name) VALUES ('${user.sub}', '${user.name}') RETURNING *`
      );
      return UserDTO.fromJSON(result.rows[0]);
    } catch (err) {
      dataLogger.error(`UserRepository.insertUser: ${err}`);
    }
    return null;
  }

  public async insertUserDevice(
    user: UserDTO,
    deviceName: string
  ): Promise<UserDTO | null> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const dbUser = await this.insertUser(client, user);
      const query = `INSERT INTO devices (user_id, name) VALUES (${
        dbUser!.id
      }, '${deviceName}')`;
      await client.query(query);
      await client.query('COMMIT');
      return dbUser;
    } catch (err) {
      dataLogger.error(`UserRepository.insertUserDevice: ${err}`);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
    return null;
  }
}
