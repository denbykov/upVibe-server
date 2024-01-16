import { User } from '@src/entities/user';

export abstract class iUserInfoAgent {
  public abstract getUserAuthorizationByToken(
    token: string
  ): Promise<User | null>;
}
