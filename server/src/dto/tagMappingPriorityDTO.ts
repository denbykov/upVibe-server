import { TagMappingPriority } from '@src/entities/tagMappingPriority';

class TagMappingPriorityDTO {
  public userId: number;
  public source: number[];
  public title: number[];
  public artist: number[];
  public album: number[];
  public picture: number[];
  public year: number[];
  public trackNumber: number[];

  constructor(
    userId: number,
    source: number[],
    title: number[],
    artist: number[],
    album: number[],
    picture: number[],
    year: number[],
    trackNumber: number[]
  ) {
    this.userId = userId;
    this.source = source;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
  }

  public static fromJSON(json: JSON.JSONObject): TagMappingPriorityDTO {
    return new TagMappingPriorityDTO(
      json.tag_mapping_priority_user_id,
      json.tag_mapping_priority_source,
      json.tag_mapping_priority_title,
      json.tag_mapping_priority_artist,
      json.tag_mapping_priority_album,
      json.tag_mapping_priority_picture,
      json.tag_mapping_priority_year,
      json.tag_mapping_priority_track_number
    );
  }

  public toEntity = (): TagMappingPriority => {
    return new TagMappingPriority(
      this.title,
      this.artist,
      this.album,
      this.picture,
      this.year,
      this.trackNumber
    );
  };
}

export { TagMappingPriorityDTO };
