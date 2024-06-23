import { PlaylistDTO } from '@src/dtos/playlistsDTO';
import { UserPlaylistFileDTO } from '@src/dtos/userPlaylistFileDTO';

export abstract class iPlaylistDatabase {
  public abstract insertUserPaylistFile(
    playlistId: string,
    fileId: string
  ): Promise<void>;
  public abstract getDefaultUserPlaylistId(userId: string): Promise<string>;
  public abstract getUserPlaylistFile(
    fileId: string,
    userId: string,
    playlistId: string
  ): Promise<UserPlaylistFileDTO | null>;
  public abstract getPlaylistsByUserId(userId: string): Promise<PlaylistDTO[]>;
  public abstract getPlaylistsByPlaylistId(
    userId: string,
    playlistId: string
  ): Promise<PlaylistDTO>;
}
