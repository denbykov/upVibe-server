class SourceDTO {
  public id: number;
  public description: string;
  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}

class FileSourceDTO extends SourceDTO {
  public logoPath: string;
  constructor(id: number, description: string, logoPath: string) {
    super(id, description);
    this.logoPath = logoPath;
  }

  public static fromJSON(json: JSON.JSONObject): FileSourceDTO {
    return new FileSourceDTO(
      json.file_sources_id,
      json.file_sources_description,
      json.file_sources_logo_path
    );
  }

  public static toJSON(source: FileSourceDTO): FileSourceDTO {
    return {
      id: source.id,
      description: source.description,
      logoPath: source.logoPath,
    };
  }
}

class TagSourceDTO extends SourceDTO {
  constructor(id: number, description: string) {
    super(id, description);
  }

  public static fromJSON(json: JSON.JSONObject): TagSourceDTO {
    return new TagSourceDTO(json.tag_sources_id, json.tag_sources_description);
  }
}

export { FileSourceDTO, TagSourceDTO };
