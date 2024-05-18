import { FileDTO } from '@dtos/fileDTO';
import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';

abstract class FileCoordinatorDatabase {
  public abstract getFileById: (id: string) => Promise<FileDTO>;
  public abstract updateFileSynchronization: (
    userFileId: string,
    isSynchronized: boolean,
  ) => Promise<void>;
  public abstract getTagsByFileId: (id: string) => Promise<TagDTO[]>;
  public abstract getTagMappings: (
    fileId: string,
    fixed: boolean
  ) => Promise<TagMappingDTO[]>;
  public abstract getTagMappingPriority: (
    userId: string,
  ) => Promise<TagMappingPriorityDTO>;
  public abstract updateTagMapping: (
    tagMapping: TagMappingDTO,
  ) => Promise<void>;
  public abstract getUserFileId: (
    fileId: string,
    userId: string,
  ) => Promise<string>;
  public abstract updateFileStatus: (
    fileId: string,
    status: string,
  ) => Promise<void>;
}

export { FileCoordinatorDatabase };
