import { User } from '@src/entities/user';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { iUserInfoAgent } from '@src/interfaces/iUserInfoAgent';
import { dataLogger } from '@src/utils/server/logger';

export class UserWorker {
  private db: iUserDatabase;
  private userInfoAgent: iUserInfoAgent;
  constructor(db: iUserDatabase, userInfoAgent: iUserInfoAgent) {
    this.db = db;
    this.userInfoAgent = userInfoAgent;
    dataLogger.trace('UserWorker initialized');
  }

  public getUser = async (sub: string): Promise<User | null> => {
    dataLogger.trace('UserWorker.getUser()');
    const user = await this.db.getUserBySub(sub);
    return user;
  };

  public handleAuthorization = async (
    rawToken: string,
    payload: JSON.JSONObject,
    permissions: Array<string>
  ): Promise<User | null> => {
    dataLogger.trace('UserWorker.handleAuthorization()');
    for (const permission of permissions) {
      if (!payload.permissions.includes(permission)) {
        return null;
      }
    }
    let dbUser = await this.getUser(payload.sub);
    if (!dbUser) {
      dbUser = await this.userInfoAgent.getUserInfoByToken(rawToken || '');
      await this.db.insertUser(dbUser!);
    }
    return dbUser;
  };
}
