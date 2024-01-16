import { Config } from '@src/entities/config';
import { User } from '@src/entities/user';
import { iUserAuth } from '@src/interfaces/iUserAuth';
import { readJSON } from '@src/utils/server/readJSON';

export class UserAuth implements iUserAuth {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }
  public getUserAuthorizationByToken = async (
    token: string
  ): Promise<User | null> => {
    const headers = new Headers();
    headers.append('Authorization', token);
    const req = await fetch(`https://${this.config.auth0Domain}/userinfo`, {
      headers: headers,
    });
    const reqData = req.status == 200 ? await readJSON(req.body!) : null;
    if (!reqData) {
      return null;
    }
    return new User(0, reqData.sub, reqData.username!);
  };
}
