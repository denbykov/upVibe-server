export class User {
  public id: number;
  public name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  public static fromJSON(json: JSON.JSONObject): User {
    return new User(json.id, json.name);
  }
}

export class LoginRequest {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}
