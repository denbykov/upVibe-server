import { Config } from '@src/entities/config';
import { File } from '@src/entities/file';
import { FileSource } from '@src/entities/source';

export abstract class iFileDatabase {
  public abstract getFiles: (usersId: number) => Promise<File[] | null>;
  public abstract getFileSources: () => Promise<FileSource[] | null>;
  public abstract getFileSource: (
    sourceId: number
  ) => Promise<FileSource | null>;
  public abstract getFileBySourceUrl: (
    sourceUrl: string
  ) => Promise<number | null>;
  public abstract postURrlFile: (
    config: Config,
    userId: number,
    sourceUrl: string,
    queue: string
  ) => Promise<void>;
  public abstract mapUserFile: (
    userId: number,
    fileId: number
  ) => Promise<boolean>;
}
