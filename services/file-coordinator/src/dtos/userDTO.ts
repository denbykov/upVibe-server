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
    return new UserDTO(json.id.toString(), json.sub, json.name);
  }
}

export { UserDTO };
