import { TagSourceDTO } from '@src/dto/source';
import { TagDTO } from '@src/dto/tag';
import { TagMappingDTO } from '@src/dto/tagMapping';

export abstract class iTagDatabase {
  public abstract getFileTags(fileId: number): Promise<TagDTO | null>;
  public abstract getFilePictureTag(tagId: number): Promise<string | null>;
  public abstract getTagSources(): Promise<Array<TagSourceDTO> | null>;
  public abstract getTagSourcePicture(sourceId: number): Promise<string | null>;

  public abstract insertTagMapping(
    tagMapping: TagMappingDTO
  ): Promise<TagMappingDTO>;
}
