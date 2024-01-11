import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';
import { User } from '@src/entities/user';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { dataLogger } from '@src/utils/server/logger';

export class UserWorker {
  private db: iUserDatabase;
  private config: Config;
  constructor(db: iUserDatabase, config: Config) {
    this.db = db;
    this.config = config;
    dataLogger.trace('TagWorker initialized');
  }

  public getUser = async (sub: string): Promise<Response | User> => {
    dataLogger.trace('UserWorker.getUser()');
    const user = await this.db.getUserBySub(sub);
    if (user == null) {
      return new Response(Response.Code.NotFound, 'User not found.', 1);
    }
    return user;
  };

  public setUser = async (user: User): Promise<User> => {
    dataLogger.trace('UserWorker.setUser()');
    return await this.db.setUser(user);
  };
}
