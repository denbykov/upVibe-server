import { TagDTO } from '@src/dto/tagDTO';
import { TagMappingDTO } from '@src/dto/tagMappingDTO';

export abstract class iTagDatabase {
  public abstract getFileTags(fileId: number): Promise<Array<TagDTO>>;
  public abstract getTag(fileId: number): Promise<TagDTO | null>;
  public abstract getTagPrimary(fileId: number): Promise<TagDTO | null>;
  public abstract insertTagMapping(
    tagMapping: TagMappingDTO
  ): Promise<TagMappingDTO>;
  public abstract insertTag(tag: TagDTO): Promise<TagDTO>;
  public abstract doesTagExist(
    fileId: number,
    sourceId: number
  ): Promise<boolean>;
}
