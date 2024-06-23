import { Config } from '@src/entities/config';
import { User } from '@src/entities/user';
import { iUserInfoAgent } from '@src/interfaces/iUserInfoAgent';
import { readJSON } from '@src/utils/server/readJSON';

export class UserInfoAgent implements iUserInfoAgent {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }
  public getUserInfoByToken = async (token: string): Promise<User | null> => {
    if (this.config.appDebug) {
      return new User('0', 'debug', 'debug');
    }
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const req = await fetch(`https://${this.config.auth0Domain}/userinfo`, {
      headers: headers,
    });
    const reqData = req.status == 200 ? await readJSON(req.body!) : null;
    if (!reqData) {
      return null;
    }
    return new User('0', reqData.sub, reqData.nickname);
  };
}
