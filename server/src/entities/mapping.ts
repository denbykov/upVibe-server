import { Source } from './source';
import { ShortTags } from './taggedFile';

class ShortMapping {
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
}

class Mapping {
  public id: number;
  public source: Source;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTags | null;
  public mapping: ShortMapping;
  constructor(
    id: number,
    source: Source,
    status: string,
    sourceUrl: string,
    tags: ShortTags | null,
    mapping: ShortMapping
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
    this.mapping = mapping;
  }
}

export { Mapping, ShortMapping };
