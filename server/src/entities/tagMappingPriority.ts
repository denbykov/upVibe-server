class TagMappingPriority {
  public title: string[];
  public artist: string[];
  public album: string[];
  public picture: string[];
  public year: string[];
  public trackNumber: string[];

  constructor(
    title: string[],
    artist: string[],
    album: string[],
    picture: string[],
    year: string[],
    trackNumber: string[]
  ) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
  }
}

export { TagMappingPriority };
