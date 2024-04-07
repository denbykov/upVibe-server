import { TagMapping } from '@src/entities/tagMapping';

class TagMappingSourceDTO {
  public id: number;
  public source: string;

  constructor(id: number, source: string) {
    this.id = id;
    this.source = source;
  }

  public static fromJSON(
    json: JSON.JSONObject
  ): TagMappingSourceDTO | TagMappingSourceDTO[] {
    if (json instanceof Array) {
      return json.map((source: JSON.JSONObject) => {
        return new TagMappingSourceDTO(
          source.tag_mapping_source_id,
          source.tag_mapping_source
        );
      });
    }
    return new TagMappingSourceDTO(
      json.tag_mapping_source_id,
      json.tag_mapping_source
    );
  }
}

class TagMappingDTO {
  public id: number | null;
  public user_id: number | null;
  public file_id: number | null;
  public title: number | TagMappingSourceDTO | TagMappingSourceDTO[];
  public artist: number | TagMappingSourceDTO | TagMappingSourceDTO[];
  public album: number | TagMappingSourceDTO | TagMappingSourceDTO[];
  public picture: number | TagMappingSourceDTO | TagMappingSourceDTO[];
  public year: number | TagMappingSourceDTO | TagMappingSourceDTO[];
  public trackNumber: number | TagMappingSourceDTO | TagMappingSourceDTO[];

  constructor(
    id: number | null,
    user_id: number | null,
    file_id: number | null,
    title: number | TagMappingSourceDTO | TagMappingSourceDTO[],
    artist: number | TagMappingSourceDTO | TagMappingSourceDTO[],
    album: number | TagMappingSourceDTO | TagMappingSourceDTO[],
    picture: number | TagMappingSourceDTO | TagMappingSourceDTO[],
    year: number | TagMappingSourceDTO | TagMappingSourceDTO[],
    trackNumber: number | TagMappingSourceDTO | TagMappingSourceDTO[]
  ) {
    this.id = id;
    this.user_id = user_id;
    this.file_id = file_id;
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
      TagMappingSourceDTO.fromJSON(json.tag_mapping_title),
      TagMappingSourceDTO.fromJSON(json.tag_mapping_artist),
      TagMappingSourceDTO.fromJSON(json.tag_mapping_album),
      TagMappingSourceDTO.fromJSON(json.tag_mapping_picture),
      TagMappingSourceDTO.fromJSON(json.tag_mapping_year),
      TagMappingSourceDTO.fromJSON(json.tag_mapping_track_number)
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
