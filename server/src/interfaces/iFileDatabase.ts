import { File } from '@src/entities/file';

import { FileSource } from './../entities/source';

export abstract class iFileDatabase {
  public abstract getFiles: (usersId: number) => Promise<File[] | null>;
  public abstract getFileSources: () => Promise<FileSource[] | null>;
  public abstract getFileSource: (
    sourceId: number
  ) => Promise<FileSource | null>;
}
