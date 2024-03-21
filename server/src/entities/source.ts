class Source {
  public id: number;
  public source: string;

  constructor(id: number, source: string) {
    this.id = id;
    this.source = source;
  }
}

export class FileSource extends Source {
  constructor(id: number, source: string) {
    super(id, source);
  }
}

export class TagSource extends Source {
  constructor(id: number, source: string) {
    super(id, source);
  }
}
