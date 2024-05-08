import { FileDTO } from '@dtos/fileDTO';
import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';

abstract class FileCoordinatorDatabase {
  public abstract getFileById: (id: string) => Promise<FileDTO>;
  public abstract updateFileSynchronization: (
    deviceId: string,
    userFileId: string,
    isSynchronized: boolean
  ) => Promise<void>;
  public abstract getTagByFileId: (id: string) => Promise<TagDTO[]>;
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

export { FileCoordinatorDatabase };
