import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';

abstract class TagMappingDatabase {
  public abstract getTagMappingByFileId: (
    userId: string,
    fileId: string
  ) => Promise<TagMappingDTO>;
  public abstract getTagsMappingPriorityByUserId: (
    userId: string
  ) => Promise<TagMappingPriorityDTO>;
  public abstract updateTagMappingById: (
    tagMapping: TagMappingDTO
  ) => Promise<void>;
}

export { TagMappingDatabase };
