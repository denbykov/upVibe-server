import { UUID } from 'crypto';

import { FileSourceDTO } from './source';
import { Status } from './status';

class FileDTO {
  public id: number;
  public path: UUID;
  public source: FileSourceDTO;
  public status: Status;
  public sourceUrl: string;
  constructor(
    id: number,
    path: UUID,
    source: FileSourceDTO,
    status: Status,
    sourceUrl: string
  ) {
    this.id = id;
    this.path = path;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
  }

  public static fromJSON = (json: JSON.JSONObject): FileDTO => {
    return new FileDTO(
      json.file_id,
      json.file_path,
      FileSourceDTO.fromJSON(json),
      json.file_status,
      json.file_source_url
    );
  };
}

type FileSourcesDTO = FileSourceDTO[];

export { FileDTO, FileSourcesDTO };
