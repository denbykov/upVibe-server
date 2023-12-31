export class File {
  public id: number;
  public source: {
    id: number;
    name: string;
  };
  public status: string;
  public statusDescription: string;
  public sourceUrl: string;
  constructor(
    id: number,
    source: { id: number; name: string },
    status: string,
    statusDescription: string,
    sourceUrl: string
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.statusDescription = statusDescription;
    this.sourceUrl = sourceUrl;
  }

  public static fromJSON = (json: JSON.JSONObject): File => {
    return new File(
      json.id,
      { id: json.source_id, name: json.source_description },
      json.status,
      json.description,
      json.source_url
    );
  };
}
