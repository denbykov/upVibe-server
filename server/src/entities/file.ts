import { UUID } from 'crypto';

import { FileSource } from './source';
import { Status } from './status';

export class File {
  public id: number;
  public path: UUID;
  public source: FileSource;
  public status: Status;
  public sourceUrl: string;
  constructor(
    id: number,
    path: UUID,
    source: FileSource,
    status: Status,
    sourceUrl: string
  ) {
    this.id = id;
    this.path = path;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
  }
}
