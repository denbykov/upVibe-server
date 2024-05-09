class FileDTO {
  public id: string;
  public path: string;
  public source: string;
  public status: string;
  public sourceUrl: string;

  constructor(
    id: string,
    path: string,
    source: string,
    status: string,
    sourceUrl: string,
  ) {
    this.id = id;
    this.path = path;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
  }

  public static fromJSON = (json: JSON.JSONObject): FileDTO => {
    return new FileDTO(
      json.file_id.toString(),
      json.file_path,
      json.file_source.toString(),
      json.file_status,
      json.file_source_url,
    );
  };
}

export { FileDTO };
