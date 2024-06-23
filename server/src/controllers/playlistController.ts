import Express from 'express';
import pg from 'pg';

import { PlaylistWorker } from '@src/business/playlistWorker';
import { PlaylistRepository } from '@src/data/playlistRepository';
import { Config } from '@src/entities/config';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './baseController';

class PlaylistController extends BaseController {
  constructor(config: Config, dbPool: pg.Pool, sqlManager: SQLManager) {
    super(config, dbPool, sqlManager);
  }

  private buildPlaylistWorker = (): PlaylistWorker => {
    return new PlaylistWorker(
      new PlaylistRepository(this.dbPool, this.sqlManager)
    );
  };

  public getPlaylistsByUser = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ): Promise<void> => {
    try {
      const { user } = req.body;
      const playlistWorker = this.buildPlaylistWorker();
      const result = await playlistWorker.getPlaylistsByUserId(user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getPlaylistsByPlaylistId = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ): Promise<void> => {
    try {
      const { user } = req.body;
      const { playlistId } = req.params;
      const playlistWorker = this.buildPlaylistWorker();
      const result = await playlistWorker.getPlaylistsByPlaylistId(
        user.id,
        playlistId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public createPlaylist = async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ): Promise<void> => {
    try {
      const { user } = req.body;
      const { name } = req.body;
      const playlistWorker = this.buildPlaylistWorker();
      const result = await playlistWorker.createPlaylist(user.id, name);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export { PlaylistController };
