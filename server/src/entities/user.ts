export class User {
  public id: number;
  public name: string;
  public password: string;
  constructor(id: number, name: string, password: string) {
    this.id = id;
    this.name = name;
    this.password = password;
  }
  public static fromJSON(json: JSON.JSONObject): User {
    return new User(json.id, json.name, json.password);
  }
}

export class LoginRequest {
  public name: string;
  public password: string;
  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }
}
