import { Status } from '@src/dtos/statusDTO';
import { Playlist } from '@src/entities/playlists';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iPlaylistDatabase } from '@src/interfaces/iPlaylistDatabase';
import { iPlaylistPlugin } from '@src/interfaces/iPlaylistPlugin';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { PlaylistMapper } from '@src/mappers/playlistMapper';

import { ProcessingError } from './processingError';

class PlaylistWorker {
  constructor(
    private readonly db: iPlaylistDatabase,
    private readonly sourceDb: iSourceDatabase,
    private readonly filePlugin: iFilePlugin,
    private readonly playlistPlugin: iPlaylistPlugin
  ) {}

  public getPlaylistsByUserId = async (userId: string): Promise<Playlist[]> => {
    const result = await this.db.getPlaylistsByUserId(userId);
    return result.map((playlistDTO) =>
      new PlaylistMapper().toEntity(playlistDTO)
    );
  };

  public getPlaylistsByPlaylistId = async (
    userId: string,
    playlistId: string
  ): Promise<Playlist> => {
    const result = await this.db.getPlaylistsByPlaylistId(userId, playlistId);
    return new PlaylistMapper().toEntity(result);
  };

  public createPlaylist = async (
    userId: string,
    url: string
  ): Promise<void> => {
    const normalizedUrl = await this.filePlugin.normalizeUrl(url);
    const existingPlaylist =
      await this.db.getPlaylistBySourceUrl(normalizedUrl);

    if (existingPlaylist) {
      if (await this.db.getUserPlaylistByUserId(userId, existingPlaylist.id)) {
        throw new ProcessingError('Playlist already exists');
      }
    }

    const sourceId = await this.filePlugin.getSource(normalizedUrl);
    const result = await this.db.insertPlaylist(
      normalizedUrl,
      sourceId,
      Status.Created
    );
    const source = await this.sourceDb.getSource(sourceId);
    await this.playlistPlugin.parsePlaylist(result.id, source!.description);
    await this.db.insertUserPlaylists(userId, result.id);
    return;
  };
}

export { PlaylistWorker };
