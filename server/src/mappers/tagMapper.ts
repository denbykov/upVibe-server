import { TagDTO } from '@src/dtos/tagDTO';
import { Tag } from '@src/entities/tag';

import { DataMapper } from '.';

class TagMapper implements DataMapper<TagDTO, Tag> {
  public toEntity = (data: TagDTO): Tag => {
    return new Tag(
      data.id,
      data.fileId,
      data.source,
      data.status,
      data.title,
      data.artist,
      data.album,
      data.year,
      data.trackNumber
    );
  };
}

export { TagMapper };
