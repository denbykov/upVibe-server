import { TagMapping } from '@src/entities/tagMapping';

class TagMappingDTO {
  public id: string | null;
  public userId: string | null;
  public fileId: string | null;
  public title: string;
  public artist: string;
  public album: string;
  public picture: string;
  public year: string;
  public trackNumber: string;

  constructor(
    id: string | null,
    userId: string | null,
    fileId: string | null,
    title: string,
    artist: string,
    album: string,
    picture: string,
    year: string,
    trackNumber: string
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
    user_id: string,
    file_id: string,
    source: string
  ): TagMappingDTO => {
    return new TagMappingDTO(
      '0',
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
      `${json.tag_mapping_id}`,
      `${json.tag_mapping_user_id}`,
      `${json.tag_mapping_file_id}`,
      `${json.tag_mapping_title}`,
      `${json.tag_mapping_artist}`,
      `${json.tag_mapping_album}`,
      `${json.tag_mapping_picture}`,
      `${json.tag_mapping_year}`,
      `${json.tag_mapping_track_number}`
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
