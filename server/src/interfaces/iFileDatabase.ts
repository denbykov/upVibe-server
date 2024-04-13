import { FileDTO } from '@src/dto/fileDTO';
import { TaggedFileDTO } from '@src/dto/taggedFileDTO';
import { UserDTO } from '@src/dto/userDTO';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<FileDTO | null>;
  public abstract getTaggedFileByUrl: (
    url: string,
    user: UserDTO
  ) => Promise<TaggedFileDTO | null>;
  public abstract getTaggedFilesByUser: (
    user: UserDTO
  ) => Promise<Array<TaggedFileDTO>>;
  public abstract insertFile: (file: FileDTO) => Promise<FileDTO>;
  public abstract insertUserFile: (
    userId: string,
    fileId: string
  ) => Promise<void>;
  public abstract getTaggedFile: (
    id: string,
    userId: string
  ) => Promise<TaggedFileDTO | null>;
  public abstract doesFileExist(fileId: string): Promise<boolean>;
  public abstract doesUserFileExist: (
    userId: string,
    fileId: string
  ) => Promise<boolean>;
}
