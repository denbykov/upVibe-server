export class SourceDTO {
  public id: string;
  public description: string;
  public allow_for_secondary_tag_parsing: boolean;
  public logoPath: string;

  constructor(
    id: string,
    description: string,
    allow_for_secondary_tag_parsing: boolean,
    logoPath: string,
  ) {
    this.id = id;
    this.description = description;
    this.allow_for_secondary_tag_parsing = allow_for_secondary_tag_parsing;
    this.logoPath = logoPath;
  }

  public static fromJSON = (json: JSON.JSONObject): SourceDTO => {
    return new SourceDTO(
      json.source_id.toString(),
      json.source_description,
      json.source_allow_for_secondary_tag_parsing,
      json.source_logo_path,
    );
  };
}
