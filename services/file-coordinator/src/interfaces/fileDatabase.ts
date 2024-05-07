import { FileDTO } from '@dtos/fileDTO';

abstract class FileDatabase {
  public abstract getFileById: (id: string) => Promise<FileDTO>;
  public abstract updateFileSynchronization: (
    deviceId: string,
    userFileId: string,
    isSynchronized: boolean
  ) => Promise<void>;
}

export { FileDatabase };
