import { UserDTO } from '@src/dto/user';

export abstract class iUserDatabase {
  public abstract getUserBySub(sub: string): Promise<UserDTO | null>;
  public abstract insertUser(user: UserDTO): Promise<UserDTO | null>;
}
