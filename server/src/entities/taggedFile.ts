class TaggedFileSource {
  public id: number;
  public description: string;
  public logoPath: string;
  constructor(id: number, description: string, logoPath: string) {
    this.id = id;
    this.description = description;
    this.logoPath = logoPath;
  }
}

class TaggedFileTag {
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

class TaggedFile {
  public id: number;
  public source: TaggedFileSource;
  public status: string;
  public sourceUrl: string;
  public tags: TaggedFileTag | null;
  constructor(
    id: number,
    source: TaggedFileSource,
    status: string,
    sourceUrl: string,
    tags: TaggedFileTag | null
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
  }
}

type TaggedFiles = Array<TaggedFile>;

export { TaggedFile, TaggedFiles, TaggedFileSource, TaggedFileTag };
