import { User } from '@src/entities/user';

class UserDTO {
  public id: string;
  public sub: string;
  public name: string;

  constructor(id: string, sub: string, name: string) {
    this.id = id;
    this.sub = sub;
    this.name = name;
  }

  public static fromJSON(json: JSON.JSONObject): UserDTO {
    return new UserDTO(`${json.id}`, json.sub, json.name);
  }

  public static toEntity(user: UserDTO): User {
    return new User(user.id, user.sub, user.name);
  }
}

export { UserDTO };
