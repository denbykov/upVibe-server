import Express from 'express';
import pg from 'pg';

import { TagMappingWorker } from '@src/business/tagMappingWorker';
import { TagMappingRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { TagMapping } from '@src/entities/tagMapping';
import { TagMappingPriority } from '@src/entities/tagMappingPriority';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './baseController';

class TagMappingController extends BaseController {
  constructor(
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(config, databasePool, sqlManager, pluginManager);
  }

  private buildTagMappingWorker = (): TagMappingWorker => {
    return new TagMappingWorker(
      new TagMappingRepository(this.databasePool, this.sqlManager)
    );
  };

  public getTagMappingPriority = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ): Promise<Express.Response> => {
    try {
      const { user } = request.body;
      const tagMappingWorker = this.buildTagMappingWorker();
      const tagMappingPriority = await tagMappingWorker.getTagMappingPriority(
        user.id
      );
      return response.status(200).json(tagMappingPriority);
    } catch (error) {
      next(error);
    }
    return response.status(500).json({ error: 'Internal server error' });
  };

  public getTagMapping = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ): Promise<Express.Response> => {
    try {
      const tagMappingWorker = this.buildTagMappingWorker();
      const fileId = Number(request.params.fileId);
      const result = await tagMappingWorker.getTagMapping(fileId);
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
    return response.status(500).json({ error: 'Internal server error' });
  };

  public updateTagMappingPriority = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ): Promise<Express.Response> => {
    try {
      const { user } = request.body;
      const mapping = new TagMappingPriority(
        request.body.title,
        request.body.artist,
        request.body.album,
        request.body.picture,
        request.body.year,
        request.body.trackNumber
      );
      const tagMappingWorker = this.buildTagMappingWorker();
      const result = await tagMappingWorker.updateTagMappingPriority(
        mapping,
        user.id
      );
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
    return response.status(500).json({ error: 'Internal server error' });
  };

  public updateTagMapping = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ): Promise<Express.Response> => {
    try {
      const fileId = Number(request.params.fileId);
      const tagMapping = new TagMapping(
        request.body.title,
        request.body.artist,
        request.body.album,
        request.body.picture,
        request.body.year,
        request.body.trackNumber
      );
      const tagMappingWorker = this.buildTagMappingWorker();
      const result = await tagMappingWorker.updateTagMapping(
        tagMapping,
        fileId
      );
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
    return response.status(500).json({ error: 'Internal server error' });
  };
}

export { TagMappingController };
