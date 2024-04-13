import { TagMappingDTO } from '@src/dtos/tagMappingDTO';

abstract class iTagMappingDatabase {
  public abstract getTagMapping(fileId: string): Promise<TagMappingDTO>;
  public abstract updateTagMapping(
    tagMapping: TagMappingDTO,
    fileId: string
  ): Promise<TagMappingDTO>;
}

export { iTagMappingDatabase };
