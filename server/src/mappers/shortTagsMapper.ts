import { ShortTagsDTO } from '@src/dtos/taggedFileDTO';
import { ShortTags } from '@src/entities/file';

import { DataMapper } from '.';

class ShortTagsMapper implements DataMapper<ShortTagsDTO, ShortTags> {
  public toEntity = (data: ShortTagsDTO): ShortTags => {
    return new ShortTags(
      data.title,
      data.artist,
      data.album,
      data.year,
      data.trackNumber
    );
  };
}

export { ShortTagsMapper };
