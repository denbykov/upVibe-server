import Express from 'express';
import pg from 'pg';

import { TagWorker } from '@src/business/tagWorker';
import { FileRepository, SourceRepository, TagRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './baseController';

class TagController extends BaseController {
  constructor(
    config: Config,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(config, dbPool, sqlManager, pluginManager);
  }

  private buildTagWorker = (): TagWorker => {
    return new TagWorker(
      new TagRepository(this.dbPool, this.sqlManager),
      new FileRepository(this.dbPool, this.sqlManager),
      new SourceRepository(this.dbPool, this.sqlManager),
      this.pluginManager!.getTagPlugin()
    );
  };

  public getFileTags = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const tagWorker = this.buildTagWorker();

      const fileId = request.params.fileId;
      const result = await tagWorker.getFileTags(fileId);
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getPictureOfTag = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const tagWorker = this.buildTagWorker();

      const tagId = request.params.tagId;
      const result = await tagWorker.getPictureOfTag(tagId);
      return response.status(200).sendFile(result);
    } catch (error) {
      next(error);
    }
  };

  public parseTags = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const tagWorker = this.buildTagWorker();

      const fileId = request.params.fileId;
      const result = await tagWorker.parseTags(fileId);
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export { TagController };
