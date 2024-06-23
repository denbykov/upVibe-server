import { Playlist } from '@src/entities/playlists';
import { iPlaylistDatabase } from '@src/interfaces/iPlaylistDatabase';
import { PlaylistMapper } from '@src/mappers/playlistMapper';

import { ProcessingError } from './processingError';

class PlaylistWorker {
  constructor(private readonly db: iPlaylistDatabase) {}

  public getPlaylistsByUserId = async (userId: string): Promise<Playlist[]> => {
    try {
      const result = await this.db.getPlaylistsByUserId(userId);
      return result.map((playlistDTO) =>
        new PlaylistMapper().toEntity(playlistDTO)
      );
    } catch (error) {
      throw new ProcessingError(`Error getting playlists - ${error}`);
    }
  };

  public getPlaylistsByPlaylistId = async (
    userId: string,
    playlistId: string
  ): Promise<Playlist> => {
    try {
      const result = await this.db.getPlaylistsByPlaylistId(userId, playlistId);
      return new PlaylistMapper().toEntity(result);
    } catch (error) {
      throw new ProcessingError(`Error getting playlist - ${error}`);
    }
  };
}

export { PlaylistWorker };
