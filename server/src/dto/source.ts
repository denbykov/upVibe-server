class SourceDTO {
  public id: number;
  public description: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}

// FixMe: Create SourceDTO version with logoPath and inherit from it
class FileSourceDTO extends SourceDTO {
  public logoPath: string;

  constructor(id: number, description: string, logoPath: string) {
    super(id, description);
    this.logoPath = logoPath;
  }

  public static fromJSON(json: JSON.JSONObject): FileSourceDTO {
    return new FileSourceDTO(
      json.file_source_id,
      json.file_source_description,
      json.file_source_logo_path
    );
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
