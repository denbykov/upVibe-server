import { Source } from './source';

class ShortTags {
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
}

class FileMapping {
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
}

class File {
  public id: number;
  public source: Source;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTags | null;
  public mapping?: FileMapping;

  constructor(
    id: number,
    source: Source,
    status: string,
    sourceUrl: string,
    tags: ShortTags | null,
    mapping?: FileMapping
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
    this.mapping = mapping;
  }
}

export { File, FileMapping, ShortTags };
