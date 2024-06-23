import { PlaylistDTO } from '@src/dtos/playlistsDTO';
import { Status } from '@src/dtos/statusDTO';
import { UserPlaylistDTO } from '@src/dtos/userPlaylistDTO';
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
  public abstract getPlaylistBySourceUrl(
    sourceUrl: string
  ): Promise<PlaylistDTO | null>;
  public abstract getUserPlaylistByUserId(
    userId: string,
    playlistId: string
  ): Promise<UserPlaylistDTO>;
  public abstract insertPlaylist(
    url: string,
    sourceId: string,
    status: Status
  ): Promise<PlaylistDTO>;
  public abstract insertUserPlaylists(
    userId: string,
    playlistId: string
  ): Promise<UserPlaylistDTO>;
}
