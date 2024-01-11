export class User {
  public id: number;
  public sub: string;
  public name: string;
  constructor(id: number, sub: string, name: string) {
    this.id = id;
    this.sub = sub;
    this.name = name;
  }
  public static fromJSON(json: JSON.JSONObject): User {
    return new User(json.id, json.sub, json.name);
  }
}

// export class LoginRequest {
//   public name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
// }
