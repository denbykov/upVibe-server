import { UserDTO } from '@src/dto/userDTO';

export abstract class iUserDatabase {
  public abstract getUserBySub(sub: string): Promise<UserDTO | null>;
  public abstract insertUser(user: UserDTO): Promise<UserDTO | null>;
}
