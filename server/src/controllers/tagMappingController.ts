import Express from 'express';
import pg from 'pg';

import { TagMappingWorker } from '@src/business/tagMappingWorker';
import { TagMappingRepository } from '@src/data/tagMappingRepository';
import { Config } from '@src/entities/config';
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
      const tagMappingWorker = this.buildTagMappingWorker();
      const tagMappingPriority = await tagMappingWorker.getTagMappingPriority();
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
      const tagMapping = await tagMappingWorker.getTagMapping(fileId);
      return response.status(200).json(tagMapping);
    } catch (error) {
      next(error);
    }
    return response.status(500).json({ error: 'Internal server error' });
  };
}

export { TagMappingController };
