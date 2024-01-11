import pg from 'pg';

import { User } from '@src/entities/user';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';

export class UserRepository implements iUserDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public async getUserBySub(sub: string): Promise<User | null> {
    const client = await this.pool.connect();
    const result = await client.query(
      `SELECT * FROM users WHERE sub = '${sub}'`
    );
    client.release();
    return result.rows[0];
  }

  public async setUser(user: User): Promise<User> {
    const client = await this.pool.connect();
    const result = await client.query(
      `INSERT INTO users (sub, name) VALUES ('${user.sub}', '${user.name}') RETURNING *`
    );
    client.release();
    return result.rows[0];
  }
}
