import { ShortTagsDTO, TaggedFileDTO } from '@src/dto/taggedFileDTO';

import { FileSource } from './source';

export class ShortTags {
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

  public static fromDTO = (dto: ShortTagsDTO): ShortTags => {
    return new ShortTags(
      dto.title,
      dto.artist,
      dto.album,
      dto.year,
      dto.trackNumber,
      dto.pictureId
    );
  };
}

export class File {
  public id: number;
  public source: FileSource;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTags | null;

  constructor(
    id: number,
    source: FileSource,
    status: string,
    sourceUrl: string,
    tags: ShortTags | null
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
  }

  public static fromDTO = (dto: TaggedFileDTO): File => {
    return new File(
      dto.id,
      FileSource.fromDTO(dto.source),
      dto.status,
      dto.sourceUrl,
      dto.tags ? ShortTags.fromDTO(dto.tags) : null
    );
  };
}
