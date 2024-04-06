class FileDTO {
  public id: number;
  public path: string;
  public source: number;
  public status: string;
  public sourceUrl: string;

  constructor(
    id: number,
    path: string,
    source: number,
    status: string,
    sourceUrl: string
  ) {
    this.id = id;
    this.path = path;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
  }

  public static fromJSON = (json: JSON.JSONObject): FileDTO => {
    return new FileDTO(
      json.file_id,
      json.file_path,
      json.file_source,
      json.file_status,
      json.file_source_url
    );
  };
}

export { FileDTO };