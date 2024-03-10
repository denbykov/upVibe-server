import Express from 'express';
import pg from 'pg';

import { FileWorker } from '@src/business/file';
import { FileRepository, TagRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './base';

class FileController extends BaseController {
  constructor(
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(config, databasePool, sqlManager, pluginManager);
  }

  public downloadFileBySource = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const { url, user } = request.body;
      const fileWorker = new FileWorker(
        new FileRepository(this.databasePool, this.sqlManager),
        new TagRepository(this.databasePool, this.sqlManager),
        this.pluginManager!
      );

      const result = await fileWorker.downloadFile(url, user);
      // FixMe replace code with constant
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
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      new TagRepository(this.databasePool, this.sqlManager),
      this.pluginManager!
    );

    const result = await fileWorker.getTaggedFilesByUser(user);
    // FixMe replace code with constant
    return response.status(200).json(result!);
  };

  public getFileSources = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      new TagRepository(this.databasePool, this.sqlManager),
      this.pluginManager!
    );

    const result = await fileWorker.getFileSources();
    return response.status(200).json(result!);
  };

  public getPictureBySourceId = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    const { sourceId } = request.params;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      new TagRepository(this.databasePool, this.sqlManager),
      this.pluginManager!
    );
    const resultWorker = await fileWorker.getPictureBySource(Number(sourceId));
    const { logoPath } = resultWorker.payload as { logoPath: string };
    return response
      .status(resultWorker.httpCode)
      .sendFile(this.config.appPathStorage + '/pictures/' + logoPath);
  };
}

export { FileController };
