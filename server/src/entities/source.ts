import { FileSourceDTO } from '@src/dto/source';

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

  public static fromDTO = (dto: FileSourceDTO): FileSource => {
    return new FileSource(dto.id, dto.description);
  };
}

export class TagSource extends Source {
  constructor(id: number, source: string) {
    super(id, source);
  }
}
