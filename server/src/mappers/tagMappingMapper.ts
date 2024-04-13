import { TagMappingDTO } from '@src/dtos/tagMappingDTO';
import { TagMapping } from '@src/entities/tagMapping';

import { DataMapper } from '.';

class TagMappingMapper implements DataMapper<TagMappingDTO, TagMapping> {
  public toEntity = (data: TagMappingDTO): TagMapping => {
    return new TagMapping(
      data.title,
      data.artist,
      data.album,
      data.picture,
      data.year,
      data.trackNumber
    );
  };

  public toDTO = (entity: TagMapping): TagMappingDTO => {
    return new TagMappingDTO(
      null,
      null,
      null,
      entity.title,
      entity.artist,
      entity.album,
      entity.picture,
      entity.year,
      entity.trackNumber
    );
  };
}

export { TagMappingMapper };
