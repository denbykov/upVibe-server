import { TagMappingDTO } from '@src/dto/tagMappingDTO';
import { TagMappingPriorityDTO } from '@src/dto/tagMappingPriorityDTO';

abstract class iTagMappingDatabase {
  public abstract getTagMappingPriority(
    userId: number
  ): Promise<TagMappingPriorityDTO>;
  public abstract getTagMapping(fileId: number): Promise<TagMappingDTO | null>;
  public abstract insertTagMappingPriority(
    tagMappingPriority: TagMappingPriorityDTO
  ): Promise<TagMappingPriorityDTO>;
  public abstract insertTagMapping(
    tagMapping: TagMappingDTO
  ): Promise<TagMappingDTO>;
}

export { iTagMappingDatabase };
