class Source {
  public id: number;
  public description: string;
  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }

  public static fromJSON(json: JSON.JSONObject): Source {
    return new Source(json.id, json.description);
  }
}

export class FileSource extends Source {
  public imagePath: string;
  constructor(id: number, description: string, imagePath: string) {
    super(id, description);
    this.imagePath = imagePath;
  }

  public static fromJSON(json: JSON.JSONObject): FileSource {
    return new FileSource(json.id, json.description, json.image_path);
  }
}

export class TagSource extends Source {
  constructor(id: number, description: string) {
    super(id, description);
  }

  public static fromJSON(json: JSON.JSONObject): TagSource {
    return new TagSource(json.id, json.description);
  }
}
