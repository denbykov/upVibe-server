import { User } from '@src/entities/user';

export abstract class iUserInfoAgent {
  public abstract getUserInfoByToken(token: string): Promise<User | null>;
}
