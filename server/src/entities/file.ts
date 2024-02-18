import { UUID } from 'crypto';

import { FileSource } from './source';
import { Status } from './status';

export class File {
  public id: number;
  public path: UUID;
  public source: FileSource;
  public status: Status;
  constructor(id: number, path: UUID, source: FileSource, status: Status) {
    this.id = id;
    this.path = path;
    this.source = source;
    this.status = status;
  }

  public static fromJSON = (json: JSON.JSONObject): File => {
    return new File(
      json.file_id,
      json.file_path,
      FileSource.fromJSON(json),
      json.file_status
    );
  };
}
