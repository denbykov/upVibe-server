import { TagSourceDTO } from '@src/dto/sourceDTO';
import { TagDTO } from '@src/dto/tagDTO';
import { TagMappingDTO } from '@src/dto/tagMappingDTO';

export abstract class iTagDatabase {
  public abstract getFileTags(fileId: number): Promise<Array<TagDTO>>;
  public abstract getTag(fileId: number): Promise<TagDTO | null>;
  public abstract getTagSources(): Promise<Array<TagSourceDTO>>;
  public abstract getTagSource(sourceId: number): Promise<TagSourceDTO | null>;

  public abstract insertTagMapping(
    tagMapping: TagMappingDTO
  ): Promise<TagMappingDTO>;
}
