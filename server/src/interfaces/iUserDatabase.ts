import { User } from '@src/entities/user';

export abstract class iUserDatabase {
  public abstract getUserBySub(sub: string): Promise<User | null>;
  public abstract insertUser(user: User): Promise<User>;
}
