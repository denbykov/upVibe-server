export class AcceessToken {
  id: number;
  userId: number;
  token: string;
  refreshTokenId: number;
  constructor(
    id: number,
    userId: number,
    token: string,
    refreshTokenId: number
  ) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.refreshTokenId = refreshTokenId;
  }
  public static fromJSON(json: JSON.JSONObject): AcceessToken {
    return new AcceessToken(
      json.id,
      json.user_id,
      json.token,
      json.refresh_token_id
    );
  }
}
