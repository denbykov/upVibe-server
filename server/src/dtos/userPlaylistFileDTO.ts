class UserPlaylistFileDTO {
  constructor(
    public readonly id: string,
    public readonly fileId: string,
    public readonly userPlaylistId: string,
    public readonly missingFromRemote: boolean
  ) {}

  public static fromJSON(json: JSON.JSONObject): UserPlaylistFileDTO {
    return new UserPlaylistFileDTO(
      json.id,
      json.fileId,
      json.userPlaylistId,
      json.missingFromRemote
    );
  }
}

export { UserPlaylistFileDTO };
