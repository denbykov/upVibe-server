import { FileDTO } from '@dtos/fileDTO';

abstract class FileDatabase {
  public abstract getFileById: (id: string) => Promise<FileDTO>;
}

export { FileDatabase };
