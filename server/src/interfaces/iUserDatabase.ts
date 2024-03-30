import pg from 'pg';

import { UserDTO } from '@src/dto/userDTO';

export abstract class iUserDatabase {
  public abstract getUserBySub(sub: string): Promise<UserDTO | null>;
  public abstract insertUser(
    client: pg.PoolClient,
    user: UserDTO
  ): Promise<UserDTO | null>;
  public abstract insertUserDevice(
    user: UserDTO,
    deviceName: string
  ): Promise<UserDTO | null>;
}
