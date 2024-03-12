class TagMappingDTO {
  public id: number;
  public user_id: number;
  public file_id: number;
  public title: number;
  public artist: number;
  public album: number;
  public picture: number;
  public year: number;
  public track_number: number;

  constructor(
    id: number,
    user_id: number,
    file_id: number,
    title: number,
    artist: number,
    album: number,
    picture: number,
    year: number,
    track_number: number
  ) {
    this.id = id;
    this.user_id = user_id;
    this.file_id = file_id;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.track_number = track_number;
  }

  public static allFromOneSource = (
    user_id: number,
    file_id: number,
    source: number
  ): TagMappingDTO => {
    return new TagMappingDTO(
      0,
      user_id,
      file_id,
      source,
      source,
      source,
      source,
      source,
      source
    );
  };

  public static fromJSON(json: JSON.JSONObject): TagMappingDTO {
    return new TagMappingDTO(
      json.tag_mapping_id,
      json.tag_mapping_user_id,
      json.tag_mapping_file_id,
      json.tag_mapping_title,
      json.tag_mapping_artist,
      json.tag_mapping_album,
      json.tag_mapping_picture,
      json.tag_mapping_year,
      json.tag_mapping_track_number
    );
  }
}

export { TagMappingDTO };
