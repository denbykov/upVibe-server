class SourceDTO {
  public id: number;
  public description: string;
  public logoPath: string;

  constructor(id: number, description: string, logoPath: string) {
    this.id = id;
    this.description = description;
    this.logoPath = logoPath;
  }
}

class FileSourceDTO extends SourceDTO {
  constructor(id: number, description: string, logoPath: string) {
    super(id, description, logoPath);
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
  constructor(id: number, description: string, logoPath: string) {
    super(id, description, logoPath);
  }

  public static fromJSON(json: JSON.JSONObject): TagSourceDTO {
    return new TagSourceDTO(
      json.tag_source_id,
      json.tag_source_description,
      json.tag_source_logo_path
    );
  }
}

export { FileSourceDTO, TagSourceDTO };
