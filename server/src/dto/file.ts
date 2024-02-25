import { FileSource } from './source';

class File {
  public id: number;
  public source: FileSource;
  public status: number;
  public sourceUrl: string;
  constructor(
    id: number,
    source: FileSource,
    status: number,
    sourceUrl: string
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
  }
}

type FileSources = FileSource[];

export { File, FileSources };
