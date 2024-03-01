class UserDTO {
  public id: number;
  public sub: string;
  public name: string;
  constructor(id: number, sub: string, name: string) {
    this.id = id;
    this.sub = sub;
    this.name = name;
  }

  public static fromJSON(json: JSON.JSONObject): UserDTO {
    return new UserDTO(json.id, json.sub, json.name);
  }
}

export { UserDTO };
