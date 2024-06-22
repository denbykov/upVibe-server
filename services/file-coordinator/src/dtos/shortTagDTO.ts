class ShortTagDTO {
  constructor(
    public title: string | null,
    public artist: string | null,
    public album: string | null,
    public year: number | null,
    public trackNumber: number | null,
    public picturePath: string | null,
  ) {}

  public static fromJSON(json: JSON.JSONObject): ShortTagDTO {
    return new ShortTagDTO(
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_year,
      json.tag_track_number,
      json.tag_picture_path,
    );
  }
}

export { ShortTagDTO };
