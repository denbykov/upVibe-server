class TagMappingSource {
  public id: number;
  public source: string;
  constructor(id: number, source: string) {
    this.id = id;
    this.source = source;
  }
}

class TagMapping {
  public title: number | TagMappingSource | TagMappingSource[];
  public artist: number | TagMappingSource | TagMappingSource[];
  public album: number | TagMappingSource | TagMappingSource[];
  public picture: number | TagMappingSource | TagMappingSource[];
  public year: number | TagMappingSource | TagMappingSource[];
  public trackNumber: number | TagMappingSource | TagMappingSource[];

  constructor(
    title: number | TagMappingSource | TagMappingSource[],
    artist: number | TagMappingSource | TagMappingSource[],
    album: number | TagMappingSource | TagMappingSource[],
    picture: number | TagMappingSource | TagMappingSource[],
    year: number | TagMappingSource | TagMappingSource[],
    trackNumber: number | TagMappingSource | TagMappingSource[]
  ) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
  }
}

export { TagMapping };
