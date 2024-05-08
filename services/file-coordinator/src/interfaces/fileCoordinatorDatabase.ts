import { FileDTO } from '@dtos/fileDTO';
import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';

abstract class FileCoordinatorDatabase {
  public abstract getFileById: (id: string) => Promise<FileDTO>;
  public abstract updateFileSynchronization: (
    userFileId: string,
    isSynchronized: boolean
  ) => Promise<void>;
  public abstract getTagsByFileId: (id: string) => Promise<TagDTO[]>;
  public abstract getTagMappingByFileId: (
    fileId: string
  ) => Promise<TagMappingDTO>;
  public abstract getTagsMappingPriorityByUserId: (
    userId: string
  ) => Promise<TagMappingPriorityDTO>;
  public abstract updateTagMappingById: (
    tagMapping: TagMappingDTO
  ) => Promise<void>;
  public abstract getUserFileIdByFileId: (fileId: string) => Promise<string>;
}

export { FileCoordinatorDatabase };