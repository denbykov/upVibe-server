import { FileDTO } from '@src/dto/fileDTO';
import { MappingDTO } from '@src/dto/mappingDTO';
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
    userId: number,
    fileId: number
  ) => Promise<void>;
  public abstract getTaggedFile: (
    id: number,
    userId: number
  ) => Promise<TaggedFileDTO>;
  public abstract getTaggedFileAndMapping: (
    id: number,
    userId: number
  ) => Promise<MappingDTO>;
  public abstract doesFileExist(fileId: number): Promise<boolean>;
  public abstract doesUserFileExist: (
    userId: number,
    fileId: number
  ) => Promise<boolean>;
}
