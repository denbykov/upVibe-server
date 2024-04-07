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

export { ShortTags };
