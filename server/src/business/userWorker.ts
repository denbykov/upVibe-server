import { UserAuth } from '@src/data/userAuthRepository';
import { Config } from '@src/entities/config';
import { User } from '@src/entities/user';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { dataLogger } from '@src/utils/server/logger';
import { readJSON } from '@src/utils/server/readJSON';

export class UserWorker {
  private db: iUserDatabase;
  private config: Config;
  constructor(db: iUserDatabase, config: Config) {
    this.db = db;
    this.config = config;
    dataLogger.trace('UserWorker initialized');
  }

  public getUser = async (sub: string): Promise<User | null> => {
    dataLogger.trace('UserWorker.getUser()');
    const user = await this.db.getUserBySub(sub);
    return user;
  };

  public insertUser = async (user: User): Promise<User> => {
    dataLogger.trace('UserWorker.insertUser()');
    return await this.db.insertUser(user);
  };

  public handleAuthorization = async (
    token: JSON.JSONObject,
    permissions: Array<string>
  ): Promise<User | null> => {
    dataLogger.trace('UserWorker.handleAuthorization()');
    for (const permission of permissions) {
      if (!token.permissions.includes(permission)) {
        return null;
      }
    }
    let dbUser = await this.getUser(token.sub);
    if (!dbUser) {
      dbUser = await new UserAuth(this.config).getUserAuthorizationByToken(
        token.authorization || ''
      );
    }
    return dbUser;
  };
}
