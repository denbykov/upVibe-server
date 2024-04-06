import Express from 'express';
import pg from 'pg';

import { FileWorker } from '@src/business/fileWorker';
import { FileRepository, SourceRepository, TagRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './baseController';

class FileController extends BaseController {
  constructor(
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(config, databasePool, sqlManager, pluginManager);
  }

  private buildFileWorker = (): FileWorker => {
    return new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      new SourceRepository(this.databasePool, this.sqlManager),
      new TagRepository(this.databasePool, this.sqlManager),
      this.pluginManager!.getFilePlugin(),
      this.pluginManager!.getTagPlugin()
    );
  };

  public downloadFileBySource = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const { url, user } = request.body;
      const fileWorker = this.buildFileWorker();

      const result = await fileWorker.downloadFile(url, user);
      response.status(200).json(result!);
    } catch (error) {
      next(error);
    }
  };

  public getFilesByUser = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const { user } = request.body;
      const fileWorker = this.buildFileWorker();

      const result = await fileWorker.getTaggedFilesByUser(user);
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getTaggedFile = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const { user } = request.body;
      const { fileId } = request.params;
      const fileWorker = this.buildFileWorker();
      const result = await fileWorker.getTaggedFile(Number(fileId), user);
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export { FileController };
