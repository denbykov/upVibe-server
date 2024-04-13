class TagDTO {
  constructor(
    public id: string,
    public fileId: string,
    public isPrimary: boolean,
    public source: string,
    public status: string,
    public title: string | null,
    public artist: string | null,
    public album: string | null,
    public year: number | null,
    public trackNumber: number | null,
    public picturePath: string | null
  ) {}

  public static fromJSON(json: JSON.JSONObject): TagDTO {
    return new TagDTO(
      json.tag_id.toString(),
      json.tag_file_id.toString(),
      json.tag_is_primary,
      json.tag_source.toString(),
      json.tag_status,
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_year,
      json.tag_track_number,
      json.tag_picture_path
    );
  }

  public static allFromOneSource = (
    id: string,
    fileId: string,
    isPrimary: boolean,
    source: string,
    status: string
  ): TagDTO => {
    return new TagDTO(
      id,
      fileId,
      isPrimary,
      source,
      status,
      null,
      null,
      null,
      null,
      null,
      null
    );
  };
}

export { TagDTO };
