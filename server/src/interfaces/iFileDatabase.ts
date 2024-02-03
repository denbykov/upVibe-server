import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { FileSource } from '@src/entities/source';
import { UnionFileTag } from '@src/entities/unionFileTag';
import { User } from '@src/entities/user';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<File | null>;
  public abstract getFilesByUser: (
    user: User
  ) => Promise<UnionFileTag[] | null>;
  public abstract getFileById: (fileId: string) => Promise<UnionFileTag | null>;
  public abstract getFileSources: () => Promise<FileSource[] | null>;
  public abstract getPictureBySourceId: (
    sourceId: string
  ) => Promise<FileSource | null>;
  public abstract getFileSource: (description: string) => Promise<FileSource>;
  public abstract insertFileRecord: (
    file: File,
    sourceId: number
  ) => Promise<File>;
  public abstract insertUserFileRecord: (
    userId: number,
    fileId: number
  ) => Promise<void | null>;
  public abstract insertTransactionFileRecord: (
    file: File,
    user: User,
    downloadFileBySource: (file: File) => Promise<Response>
  ) => Promise<Response>;
}
