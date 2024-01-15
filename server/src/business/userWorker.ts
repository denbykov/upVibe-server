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
    if (user == null) {
      return null;
    }
    return user;
  };

  public insertUser = async (user: User): Promise<User> => {
    dataLogger.trace('UserWorker.insertUser()');
    return await this.db.insertUser(user);
  };

  public manageUser = async (
    token: JSON.JSONObject,
    permissions: Array<string>
  ): Promise<User | null> => {
    dataLogger.trace('UserWorker.manageUser()');
    for (const permission of permissions) {
      if (!token.permissions.includes(permission)) {
        return null;
      }
    }
    let dbUser = await this.getUser(token.sub);
    if (!dbUser) {
      const headers = new Headers();
      headers.append('Authorization', token.authorization || '');
      const req = await fetch(`https://${this.config.auth0Domain}/userinfo`, {
        headers: headers,
      });
      const reqData = req.status == 200 ? await readJSON(req.body!) : {};
      dbUser = await this.insertUser(new User(0, token.sub, reqData.username!));
    }
    return dbUser;
  };
}
