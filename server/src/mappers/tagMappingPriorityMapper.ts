import { TagMappingPriorityDTO } from '@src/dtos/tagMappingPriorityDTO';
import { TagMappingPriority } from '@src/entities/tagMappingPriority';

import { DataMapper } from '.';

class TagMappingPriorityMapper
  implements DataMapper<TagMappingPriorityDTO, TagMappingPriority>
{
  public toEntity = (data: TagMappingPriorityDTO): TagMappingPriority => {
    return new TagMappingPriority(
      data.title,
      data.artist,
      data.album,
      data.picture,
      data.year,
      data.trackNumber
    );
  };

  public toDTO = (entity: TagMappingPriority): TagMappingPriorityDTO => {
    return {
      userId: '-1',
      source: ['-1'],
      title: entity.title,
      artist: entity.artist,
      album: entity.album,
      picture: entity.picture,
      year: entity.year,
      trackNumber: entity.trackNumber,
    };
  };
}

export { TagMappingPriorityMapper };
