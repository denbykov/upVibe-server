import { File } from './file';
import { TagMapping } from './tagMapping';

export class GetFileResponse {
  public file: File;
  public mapping: TagMapping | null;

  constructor(file: File, mapping: TagMapping | null) {
    this.file = file;
    this.mapping = mapping;
  }
}
