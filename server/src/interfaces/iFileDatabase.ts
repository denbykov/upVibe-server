import { Config } from '@src/entities/config';
import { File } from '@src/entities/file';
import { FileSource } from '@src/entities/source';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<File | null>;
  public abstract insertFileRecord: (file: File) => Promise<File | null>;
}
