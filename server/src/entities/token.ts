export class Token {
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
  public static fromJSON(json: JSON.JSONObject): Token {
    return new Token(json.id, json.user_id, json.token, json.refresh_token_id);
  }
}

export class RefreshToken {
  id: number;
  token: string;
  constructor(id: number, token: string) {
    this.id = id;
    this.token = token;
  }
  public static fromJSON(json: JSON.JSONObject): RefreshToken {
    return new RefreshToken(json.id, json.token);
  }
}
