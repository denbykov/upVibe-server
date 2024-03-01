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
  constructor(id: number, description: string, logoPath: string) {
    super(id, description);
    this.logoPath = logoPath;
  }
}

export class TagSource extends Source {
  constructor(id: number, description: string) {
    super(id, description);
  }
}

export type FileSources = FileSource[];
