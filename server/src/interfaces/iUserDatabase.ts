import { User } from '@src/entities/user';

export abstract class iUserDatabase {
  public abstract getUserBySub(sub: string): Promise<User | null>;
  public abstract setUser(user: User): Promise<User>;
}
