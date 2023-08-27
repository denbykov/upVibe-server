export class Tag {
  public id: number;
  public fileId: number;
  public title: string;
  public artist: string;
  public album: string;
  public picturePath: string;
  public year: Date;
  public trackNumber: number;
  public sourceType: { id: number; description: string };
  public status: { status: string; description: string };
  constructor(
    id: number,
    fileId: number,
    title: string,
    artist: string,
    album: string,
    picturePath: string,
    year: Date,
    trackNumber: number,
    sourceType: { id: number; description: string },
    status: { status: string; description: string }
  ) {
    this.id = id;
    this.fileId = fileId;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picturePath = picturePath;
    this.year = year;
    this.trackNumber = trackNumber;
    this.sourceType = sourceType;
    this.status = status;
  }
  public static fromJSON(json: JSON.JSONObject): Tag {
    return new Tag(
      json.id,
      json.file_id,
      json.title,
      json.artist,
      json.album,
      json.picture_path,
      json.year,
      json.track_number,
      { id: json.source_type_id, description: json.source_type_description },
      { status: json.status, description: json.status_description }
    );
  }
}
