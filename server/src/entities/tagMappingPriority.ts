class TagMappingPriority {
  public title: number[];
  public artist: number[];
  public album: number[];
  public picture: number[];
  public year: number[];
  public trackNumber: number[];

  constructor(
    title: number[],
    artist: number[],
    album: number[],
    picture: number[],
    year: number[],
    trackNumber: number[]
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
