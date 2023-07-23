export class RefreshToken {
  id: number;
  token: string;
  userId: number;
  constructor(id: number, token: string, userId: number) {
    this.id = id;
    this.token = token;
    this.userId = userId;
  }
  public static fromJSON(json: JSON.JSONObject): RefreshToken {
    return new RefreshToken(json.id, json.token, json.user_id);
  }
}
