import Express from 'express';

import { FileWorker } from '@src/business/fileWorker';
import { FileRepository, SourceRepository, TagRepository } from '@src/data';
import { DBManager } from '@src/dbManager';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './baseController';

class FileController extends BaseController {
  constructor(
    config: Config,
    dbManager: DBManager,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(config, dbManager, sqlManager, pluginManager);
  }

  private buildFileWorker = (): FileWorker => {
    return new FileWorker(
      new FileRepository(this.dbManager, this.sqlManager),
      new SourceRepository(this.dbManager, this.sqlManager),
      new TagRepository(this.dbManager, this.sqlManager),
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
      const { expand } = request.query;
      const fileWorker = this.buildFileWorker();
      const expandOptions = expand ? expand.toString().split(',') : [];
      const result = await fileWorker.getTaggedFile(
        fileId,
        user,
        expandOptions
      );
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export { FileController };
