import { SourceDTO } from './sourceDTO';

class ShortTagsDTO {
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

  public empty = (): boolean => {
    return (
      this.title === null &&
      this.artist === null &&
      this.album === null &&
      this.year === null &&
      this.trackNumber === null
    );
  };

  public static fromJSON = (json: JSON.JSONObject): ShortTagsDTO => {
    return new ShortTagsDTO(
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_year,
      json.tag_track_number
    );
  };
}

class TaggedFileDTO {
  public id: string;
  public source: SourceDTO;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTagsDTO | null;

  constructor(
    id: string,
    source: SourceDTO,
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
      json.file_id.toString(),
      SourceDTO.fromJSON(json),
      json.file_status,
      json.file_source_url,
      shortTags.empty() ? null : shortTags
    );
  };
}

export { TaggedFileDTO, ShortTagsDTO };
