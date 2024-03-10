import { FileSourceDTO } from './source';

class ShortTagsDTO {
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

  public empty = (): boolean => {
    return (
      this.title === null &&
      this.artist === null &&
      this.album === null &&
      this.year === null &&
      this.trackNumber === null &&
      this.pictureId === null
    );
  };

  public static fromJSON = (json: JSON.JSONObject): ShortTagsDTO => {
    return new ShortTagsDTO(
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_year,
      json.tag_track_number,
      json.tag_picture_id
    );
  };
}

class TaggedFileDTO {
  public id: number;
  public source: FileSourceDTO;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTagsDTO | null;

  constructor(
    id: number,
    source: FileSourceDTO,
    status: string,
    sourceUrl: string,
    tags: ShortTagsDTO | null
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
  }

  public static fromJSON = (json: JSON.JSONObject): TaggedFileDTO => {
    const shortTags = ShortTagsDTO.fromJSON(json);
    return new TaggedFileDTO(
      json.file_id,
      FileSourceDTO.fromJSON(json),
      json.file_status,
      json.file_source_url,
      shortTags.empty() ? null : shortTags
    );
  };
}

export { TaggedFileDTO, ShortTagsDTO };
