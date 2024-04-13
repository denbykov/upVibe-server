import { UserDTO } from '@src/dtos/userDTO';
import { User } from '@src/entities/user';

import { DataMapper } from '.';

class UserMapper implements DataMapper<UserDTO, User> {
  public toEntity = (data: UserDTO): User => {
    return new User(data.id, data.sub, data.name);
  };
}

export { UserMapper };
