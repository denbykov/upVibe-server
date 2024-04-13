import { Source } from './source';

class ShortTags {
  public title: string;
  public artist: string;
  public album: string;
  public year: number;
  public trackNumber: number;

  constructor(
    title: string,
    artist: string,
    album: string,
    year: number,
    trackNumber: number
  ) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.year = year;
    this.trackNumber = trackNumber;
  }
}

class File {
  public id: string;
  public source: Source;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTags | null;

  constructor(
    id: string,
    source: Source,
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
}

export { File, ShortTags };
