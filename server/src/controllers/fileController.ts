import Express from 'express';
import pg from 'pg';

import { FileWorker } from '@src/business/fileWorker';
import { FileRepository, TagRepository } from '@src/data';
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
    response: Express.Response
  ) => {
    const { user } = request.body;
    const fileWorker = this.buildFileWorker();

    const result = await fileWorker.getTaggedFilesByUser(user);
    return response.status(200).json(result);
  };

  public getSources = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    const fileWorker = this.buildFileWorker();

    const result = await fileWorker.getSources();
    return response.status(200).json(result);
  };

  public getSourceLogo = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    const { sourceId } = request.params;
    const fileWorker = this.buildFileWorker();
    const result = await fileWorker.getSourceLogo(Number(sourceId));
    return response.status(200).sendFile(result);
  };
}

export { FileController };
