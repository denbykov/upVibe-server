import { TagMapping } from '@src/entities/tagMapping';

class TagMappingDTO {
  public id: number | null;
  public userId: number | null;
  public fileId: number | null;
  public title: number;
  public artist: number;
  public album: number;
  public picture: number;
  public year: number;
  public trackNumber: number;

  constructor(
    id: number | null,
    userId: number | null,
    fileId: number | null,
    title: number,
    artist: number,
    album: number,
    picture: number,
    year: number,
    trackNumber: number
  ) {
    this.id = id;
    this.userId = userId;
    this.fileId = fileId;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
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

  public static fromEntity = (tagMapping: TagMapping): TagMappingDTO => {
    return new TagMappingDTO(
      null,
      null,
      null,
      tagMapping.title,
      tagMapping.artist,
      tagMapping.album,
      tagMapping.picture,
      tagMapping.year,
      tagMapping.trackNumber
    );
  };

  public toEntity = (): TagMapping => {
    return new TagMapping(
      this.title,
      this.artist,
      this.album,
      this.picture,
      this.year,
      this.trackNumber
    );
  };
}

export { TagMappingDTO };
