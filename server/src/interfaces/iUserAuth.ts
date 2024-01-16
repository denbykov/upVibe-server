import { User } from '@src/entities/user';

export abstract class iUserAuth {
  public abstract getUserAuthorizationByToken(
    token: string
  ): Promise<User | null>;
}
