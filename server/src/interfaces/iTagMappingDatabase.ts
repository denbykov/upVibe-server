import { TagMappingDTO } from '@src/dto/tagMappingDTO';
import { TagMappingPriorityDTO } from '@src/dto/tagMappingPriorityDTO';

abstract class iTagMappingDatabase {
  public abstract getTagMappingPriority(
    userId: number
  ): Promise<TagMappingPriorityDTO>;
  public abstract getTagMapping(fileId: number): Promise<TagMappingDTO>;
  public abstract insertTagMappingPriority(
    tagMappingPriority: TagMappingPriorityDTO
  ): Promise<TagMappingPriorityDTO>;
  public abstract insertTagMapping(
    tagMapping: TagMappingDTO
  ): Promise<TagMappingDTO>;
  public abstract doesTagMappingPriorityExist(userId: number): Promise<boolean>;
  public abstract doesTagMappingExist(fileId: number): Promise<boolean>;
}

export { iTagMappingDatabase };
