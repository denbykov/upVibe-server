import { SourceDTO } from '@src/dtos/sourceDTO';
import { Source } from '@src/entities/source';

import { DataMapper } from '.';

class SourceMapper implements DataMapper<SourceDTO, Source> {
  public toEntity = (data: SourceDTO): Source => {
    return new Source(data.id, data.description);
  };
}

export { SourceMapper };
