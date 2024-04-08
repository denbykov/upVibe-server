import { Mapping, ShortMapping } from '@src/entities/mapping';

import { SourceDTO } from './sourceDTO';
import { ShortTagsDTO } from './taggedFileDTO';

class ShortMappingDTO {
  public title: number;
  public artist: number;
  public album: number;
  public picture: number;
  public year: number;
  public trackNumber: number;
  constructor(
    title: number,
    artist: number,
    album: number,
    picture: number,
    year: number,
    trackNumber: number
  ) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
  }
  public static fromJSON(json: JSON.JSONObject): ShortMappingDTO {
    return new ShortMappingDTO(
      json.mapping_title,
      json.mapping_artist,
      json.mapping_album,
      json.mapping_picture,
      json.mapping_year,
      json.mapping_trackNumber
    );
  }

  public toEntity(): ShortMapping {
    return new ShortMapping(
      this.title,
      this.artist,
      this.album,
      this.picture,
      this.year,
      this.trackNumber
    );
  }
}

class MappingDTO {
  public id: number;
  public source: SourceDTO;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTagsDTO | null;
  public mapping: ShortMappingDTO;
  constructor(
    id: number,
    source: SourceDTO,
    status: string,
    sourceUrl: string,
    tags: ShortTagsDTO | null,
    mapping: ShortMappingDTO
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
    this.mapping = mapping;
  }

  public static fromJSON(json: JSON.JSONObject): MappingDTO {
    const tags = ShortTagsDTO.fromJSON(json);
    return new MappingDTO(
      json.file_id,
      SourceDTO.fromJSON(json),
      json.file_status,
      json.file_source_url,
      tags ? tags : null,
      ShortMappingDTO.fromJSON(json)
    );
  }

  public toEntity(): Mapping {
    return new Mapping(
      this.id,
      this.source.toEntity(),
      this.status,
      this.sourceUrl,
      this.tags ? this.tags.toEntity() : null,
      this.mapping.toEntity()
    );
  }
}

export { MappingDTO, ShortMappingDTO };
