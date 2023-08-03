export class RefreshToken {
  id: number;
  token: string;
  parentId: number | null;
  userId: number;
  commonAncestorId: number | null;
  status: string;
  constructor(
    id: number,
    token: string,
    parentId: number | null,
    userId: number,
    commonAncestorId: number | null,
    status: string
  ) {
    this.id = id;
    this.token = token;
    this.parentId = parentId;
    this.userId = userId;
    this.commonAncestorId = commonAncestorId;
    this.status = status;
  }
  public static fromJSON(json: JSON.JSONObject): RefreshToken {
    return new RefreshToken(
      json.id,
      json.token,
      json.parent_id,
      json.user_id,
      json.common_ancestor_id,
      json.status
    );
  }
}
