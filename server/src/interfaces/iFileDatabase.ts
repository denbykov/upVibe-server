import { FileDTO } from '@src/dto/file';
import { FileSourceDTO, TagSourceDTO } from '@src/dto/source';
import { TaggedFileDTO } from '@src/dto/taggedFile';
import { UserDTO } from '@src/dto/user';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<FileDTO | null>;
  public abstract getTaggedFileByUrl: (
    url: string,
    user: UserDTO
  ) => Promise<TaggedFileDTO | null>;
  public abstract getTaggedFilesByUser: (
    user: UserDTO
  ) => Promise<Array<TaggedFileDTO>>;
  public abstract getFileSources: () => Promise<Array<FileSourceDTO>>;
  public abstract getTagSources: (
    description: string
  ) => Promise<Array<TagSourceDTO>>;
  public abstract insertFile: (file: FileDTO) => Promise<FileDTO>;
  public abstract insertUserFile: (
    userId: number,
    fileId: number
  ) => Promise<void>;
  public abstract getFileSource: (id: number) => Promise<FileSourceDTO>;
  public abstract doesUserFileExist: (
    userId: number,
    fileId: number
  ) => Promise<boolean>;
}
