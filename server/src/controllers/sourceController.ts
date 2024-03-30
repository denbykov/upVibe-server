import Express from 'express';
import pg from 'pg';

import { SourceWorker } from '@src/business/sourceWorker';
import { SourceRepository } from '@src/data/sourceRepository';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './baseController';

class SourceController extends BaseController {
  constructor(
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(config, databasePool, sqlManager, pluginManager);
  }

  private buildWorker = (): SourceWorker => {
    return new SourceWorker(
      new SourceRepository(this.databasePool, this.sqlManager)
    );
  };

  public getSources = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const tagWorker = this.buildWorker();

      const result = await tagWorker.getSources();
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getSourceLogo = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const tagWorker = this.buildWorker();

      const sourceId = Number(request.params.sourceId);
      const result = await tagWorker.getSourceLogo(sourceId);
      return response.status(200).sendFile(result);
    } catch (error) {
      next(error);
    }
  };
}

export { SourceController };
