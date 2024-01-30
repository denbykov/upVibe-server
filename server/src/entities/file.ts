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
      json.id,
      json.path,
      {
        id: json.source_id,
        url: json.source_url,
        description: json.source_description,
        logoPath: json.source_logo_path,
      },
      json.status
    );
  };
}
