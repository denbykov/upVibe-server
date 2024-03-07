class TaggedFileSourceDTO {
  public id: number;
  public description: string;
  public logoPath: string;
  constructor(id: number, description: string, logoPath: string) {
    this.id = id;
    this.description = description;
    this.logoPath = logoPath;
  }

  public static fromJSON = (json: JSON.JSONObject): TaggedFileSourceDTO => {
    return new TaggedFileSourceDTO(
      json.file_source_id,
      json.file_source_description,
      json.file_source_logo_path
    );
  };
}

class TaggedFileTagDTO {
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

  public static fromJSON = (json: JSON.JSONObject): TaggedFileTagDTO => {
    return new TaggedFileTagDTO(
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
  public source: TaggedFileSourceDTO;
  public status: string;
  public sourceUrl: string;
  public tags: TaggedFileTagDTO | null;
  constructor(
    id: number,
    source: TaggedFileSourceDTO,
    status: string,
    sourceUrl: string,
    tags: TaggedFileTagDTO | null
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
  }

  public static fromJSON = (json: JSON.JSONObject): TaggedFileDTO => {
    return new TaggedFileDTO(
      json.file_id,
      TaggedFileSourceDTO.fromJSON(json),
      json.file_status,
      json.file_source_url,
      TaggedFileTagDTO.fromJSON(json)
    );
  };
}

type TaggedFilesDTO = Array<TaggedFileDTO>;

export { TaggedFileDTO, TaggedFilesDTO, TaggedFileSourceDTO, TaggedFileTagDTO };
