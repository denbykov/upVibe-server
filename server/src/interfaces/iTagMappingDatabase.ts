import { TagMappingDTO } from '@src/dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@src/dtos/tagMappingPriorityDTO';

abstract class iTagMappingDatabase {
  public abstract getTagMapping(fileId: string): Promise<TagMappingDTO>;
  public abstract updateTagMapping(
    tagMapping: TagMappingDTO,
    fileId: string
  ): Promise<TagMappingDTO>;
  public abstract getTagMappingPriority(
    userId: string
  ): Promise<TagMappingPriorityDTO | null>;
}

export { iTagMappingDatabase };
