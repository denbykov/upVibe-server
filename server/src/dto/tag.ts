class TagDTO {
  public title: string;
  public artist: string;
  public album: string;
  public year: number;
  public trackNumber: number;
  public pictureId: number;
  constructor(
    title: string,
    artist: string,
    album: string,
    year: number,
    trackNumber: number,
    pictureId: number
  ) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.year = year;
    this.trackNumber = trackNumber;
    this.pictureId = pictureId;
  }

  public static fromJSON(json: JSON.JSONObject): TagDTO {
    return new TagDTO(
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_year,
      json.tag_track_number,
      json.tag_picture_id
    );
  }
}

class TagMappingDTO {
  public userId: number;
  public id: number;
  public fileId: number;
  public title: number;
  public artist: number;
  public album: number;
  public picture: number;
  public year: number;
  public trackNumber: number;
  constructor(
    userId: number,
    id: number,
    fileId: number,
    title: number,
    artist: number,
    album: number,
    picture: number,
    year: number,
    trackNumber: number
  ) {
    this.userId = userId;
    this.id = id;
    this.fileId = fileId;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
  }

  public static fromJSON(json: JSON.JSONObject): TagMappingDTO {
    return new TagMappingDTO(
      json.mapping_user_id,
      json.mapping_tag_id,
      json.mapping_tag_file_id,
      json.mapping_tag_title,
      json.mapping_tag_artist,
      json.mapping_tag_album,
      json.mapping_tag_picture,
      json.mapping_tag_year,
      json.mapping_tag_track_number
    );
  }
}

export { TagDTO, TagMappingDTO };
