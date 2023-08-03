export class AccessToken {
  id: number;
  token: string;
  parentId: number;
  userId: number;
  constructor(id: number, token: string, parentId: number, userId: number) {
    this.id = id;
    this.token = token;
    this.parentId = parentId;
    this.userId = userId;
  }
  public static fromJSON(json: JSON.JSONObject): AccessToken {
    return new AccessToken(json.id, json.token, json.parent_id, json.user_id);
  }
}
