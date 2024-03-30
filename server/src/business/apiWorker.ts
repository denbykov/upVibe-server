import { UUID } from 'crypto';

import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { iUserInfoAgent } from '@src/interfaces/iUserInfoAgent';

class APIWorker {
  private db: iUserDatabase;
  private userAgent: iUserInfoAgent;

  constructor(db: iUserDatabase, userAgent: iUserInfoAgent) {
    this.db = db;
    this.userAgent = userAgent;
  }

  public registerUser = async (rawToken: string, name: UUID) => {
    const user = await this.userAgent.getUserInfoByToken(rawToken);
    return await this.db.insertUserDevice(user!, name);
  };
}

export { APIWorker };
