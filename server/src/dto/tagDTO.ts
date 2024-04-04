import { Tag } from '@src/entities/tag';

class TagDTO {
  constructor(
    public id: number,
    public fileId: number,
    public isPrimary: boolean,
    public source: number,
    public status: string,
    public title: string | null,
    public artist: string | null,
    public album: string | null,
    public year: number | null,
    public trackNumber: number | null,
    public picturePath: string | null
  ) {}

  public static fromJSON(json: JSON.JSONObject): TagDTO {
    return new TagDTO(
      json.tag_id,
      json.tag_file_id,
      json.tag_is_primary,
      json.tag_source,
      json.tag_status,
      json.tag_title,
      json.tag_artist,
      json.tag_album,
      json.tag_year,
      json.tag_track_number,
      json.tag_picture_path
    );
  }

  public toEntity = (): Tag => {
    return new Tag(
      this.id,
      this.fileId,
      this.source,
      this.status,
      this.title,
      this.artist,
      this.album,
      this.year,
      this.trackNumber,
      this.picturePath
    );
  };

  public static allFromOneSource = (
    id: number,
    fileId: number,
    isPrimary: boolean,
    source: number,
    status: string
  ): TagDTO => {
    return new TagDTO(
      id,
      fileId,
      isPrimary,
      source,
      status,
      null,
      null,
      null,
      null,
      null,
      null
    );
  };
}

export { TagDTO };
