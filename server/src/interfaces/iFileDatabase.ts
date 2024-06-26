import { FileDTO } from '@src/dtos/fileDTO';
import { TaggedFileDTO } from '@src/dtos/taggedFileDTO';
import { UserDTO } from '@src/dtos/userDTO';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<FileDTO | null>;
  public abstract getTaggedFileByUrl: (
    url: string,
    user: UserDTO
  ) => Promise<TaggedFileDTO | null>;
  public abstract getTaggedFilesByUser: (
    user: UserDTO,
    deviceId: string,
    statuses: Array<string> | null,
    synchronized: boolean | null
  ) => Promise<Array<TaggedFileDTO>>;
  public abstract insertFile: (file: FileDTO) => Promise<FileDTO>;
  public abstract insertUserFile: (
    userId: string,
    fileId: string
  ) => Promise<string>;
  public abstract getTaggedFile: (
    id: string,
    deviceId: string,
    userId: string
  ) => Promise<TaggedFileDTO | null>;
  public abstract doesFileExist(fileId: string): Promise<boolean>;
  public abstract doesUserFileExist: (
    userId: string,
    fileId: string
  ) => Promise<boolean>;
  public abstract insertSynchronizationRecords: (
    userId: string,
    userFileId: string
  ) => Promise<void>;
  public abstract InserSyncrhonizationRecords: (
    deviceId: string,
    userFileId: string
  ) => Promise<void>;
  public abstract updateSynchronizationRecords: (
    timestamp: string,
    userFileId: string
  ) => Promise<void>;
  public abstract getUserFiles: (
    userId: string,
    fileId: string
  ) => Promise<Array<string>>;
  public abstract getUserFileIds: (userId: string) => Promise<Array<string>>;
  public abstract confirmFile: (
    fileId: string,
    userId: string,
    deviceId: string
  ) => Promise<void>;
  public abstract getFile(id: string): Promise<FileDTO | null>;
}
