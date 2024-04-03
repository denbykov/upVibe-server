import pg from 'pg';

import { DeviceDTO } from '@src/dto/deviceDTO';
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

  public async getDeviceByUser(user: UserDTO): Promise<DeviceDTO | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM devices WHERE user_id = ${user.id}`
      );

      if (result.rows.length === 0) return null;
      return DeviceDTO.fromJSON(result.rows[0]);
    } catch (err) {
      dataLogger.error(`UserRepository.getDeviceByUser: ${err}`);
    } finally {
      client.release();
    }
    return null;
  }

  public async insertUser(user: UserDTO): Promise<UserDTO> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (sub, name) VALUES ('${user.sub}', '${user.name}') RETURNING *`
      );
      return UserDTO.fromJSON(result.rows[0]);
    } catch (err) {
      dataLogger.error(`UserRepository.insertUser: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  }

  public async insertUserDevice(
    user: UserDTO,
    deviceName: string
  ): Promise<DeviceDTO> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO devices (user_id, name) VALUES (${user.id}, '${deviceName}') RETURNING *`
      );
      return DeviceDTO.fromJSON(result.rows[0]);
    } catch (err) {
      dataLogger.error(`UserRepository.insertUserDevice: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  }
}
