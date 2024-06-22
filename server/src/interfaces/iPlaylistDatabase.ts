import { UserPlaylistFileDTO } from '@src/dtos/userPlaylistFileDTO';

export abstract class iPlaylistDatabase {
  public abstract insertUserPaylistFiles(
    playlistId: string,
    fileId: string
  ): Promise<void>;
  public abstract getDefaultUserPlaylistId(userId: string): Promise<string>;
  public abstract getUserPlaylistFile(
    fileId: string,
    userId: string,
    playlistId: string
  ): Promise<UserPlaylistFileDTO | null>;
}
