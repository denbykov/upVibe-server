import { File, ShortTags } from '@src/entities/file';

import { SourceDTO } from './sourceDTO';

class ShortTagsDTO {
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

  public empty = (): boolean => {
    return (
      this.title === null &&
      this.artist === null &&
      this.album === null &&
      this.year === null &&
      this.trackNumber === null &&
      this.pictureId === null
    );
  };

  public static fromJSON = (json: JSON.JSONObject): ShortTagsDTO => {
    return new ShortTagsDTO(
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_year,
      json.tag_track_number,
      json.tag_picture_id
    );
  };

  public toEntity = (): ShortTags => {
    return new ShortTags(
      this.title,
      this.artist,
      this.album,
      this.year,
      this.trackNumber,
      this.pictureId
    );
  };
}

class FileMappingDTO {
  public title: number;
  public artist: number;
  public album: number;
  public year: number;
  public trackNumber: number;
  public pictureId: number;

  constructor(
    title: number,
    artist: number,
    album: number,
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

  public static fromJSON = (json: JSON.JSONObject): FileMappingDTO => {
    return new FileMappingDTO(
      json.file_mapping_title,
      json.file_mapping_artist,
      json.file_mapping_album,
      json.file_mapping_year,
      json.file_mapping_track_number,
      json.file_mapping_picture
    );
  };
}

class TaggedFileDTO {
  public id: number;
  public source: SourceDTO;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTagsDTO | null;
  public mapping?: FileMappingDTO;

  constructor(
    id: number,
    source: SourceDTO,
    status: string,
    sourceUrl: string,
    tags: ShortTagsDTO | null,
    mapping?: FileMappingDTO
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
    this.mapping = mapping;
  }

  public static fromJSON = (json: JSON.JSONObject): TaggedFileDTO => {
    const shortTags = ShortTagsDTO.fromJSON(json);
    const fileMapping = FileMappingDTO.fromJSON(json);
    return new TaggedFileDTO(
      json.file_id,
      SourceDTO.fromJSON(json),
      json.file_status,
      json.file_source_url,
      shortTags.empty() ? null : shortTags,
      fileMapping
    );
  };

  public toEntity = (): File => {
    return new File(
      this.id,
      this.source.toEntity(),
      this.status,
      this.sourceUrl,
      this.tags ? this.tags.toEntity() : null,
      this.mapping ? this.mapping : undefined
    );
  };
}

export { TaggedFileDTO, ShortTagsDTO };
