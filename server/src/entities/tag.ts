import { TagSource } from './source';
import { Status } from './status';

export class Tag {
  public id: number;
  public fileId: number;
  public title: string;
  public artist: string;
  public album: string;
  public picturePath: string;
  public year: number;
  public trackNumber: number;
  public sourceType: TagSource;
  public status: Status;
  constructor(
    id: number,
    fileId: number,
    title: string,
    artist: string,
    album: string,
    picturePath: string,
    year: number,
    trackNumber: number,
    sourceType: TagSource,
    status: Status
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
      json.tag_id,
      json.tag_file_id,
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_picture_path,
      json.tag_year,
      json.tag_track_number,
      TagSource.fromJSON(json),
      json.tag_status
    );
  }
}

export class TagMapping {
  public userId: number;
  public id: number;
  public fileId: number;
  public title: number;
  public artist: number;
  public album: number;
  public picture: number;
  public year: number;
  public trackNumber: number;
  constructor(
    userId: number,
    id: number,
    fileId: number,
    title: number,
    artist: number,
    album: number,
    picture: number,
    year: number,
    trackNumber: number
  ) {
    this.userId = userId;
    this.id = id;
    this.fileId = fileId;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
  }

  public static fromJSON(json: JSON.JSONObject): TagMapping {
    return new TagMapping(
      json.mapping_user_id,
      json.mapping_tag_id,
      json.mapping_tag_file_id,
      json.mapping_tag_title,
      json.mapping_tag_artist,
      json.mapping_tag_album,
      json.mapping_tag_picture,
      json.mapping_tag_year,
      json.mapping_tag_track_number
    );
  }
}
