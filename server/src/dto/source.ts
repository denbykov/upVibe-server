class Source {
  public id: number;
  public description: string;
  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}

export class FileSource extends Source {
  public logoPath: string;
  constructor(id: number, url: string, description: string, logoPath: string) {
    super(id, description);
    this.logoPath = logoPath;
  }

  public static fromJSON(json: JSON.JSONObject): FileSource {
    return new FileSource(
      json.file_sources_id,
      json.file_sources_url,
      json.file_sources_description,
      json.file_sources_logo_path
    );
  }

  public static toJSON(source: FileSource): FileSource {
    return {
      id: source.id,
      description: source.description,
      logoPath: source.logoPath,
    };
  }
}

export class TagSource extends Source {
  constructor(id: number, description: string) {
    super(id, description);
  }

  public static fromJSON(json: JSON.JSONObject): TagSource {
    return new TagSource(json.tag_sources_id, json.tag_sources_description);
  }
}
