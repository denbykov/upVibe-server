import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { User } from '@src/entities/user';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<File | null>;
  public abstract getFileSource: (description: string) => Promise<{
    id: number;
    logoPath: string;
  } | null>;
  public abstract insertFileRecord: (
    file: File,
    sourceId: number
  ) => Promise<File | null>;
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
