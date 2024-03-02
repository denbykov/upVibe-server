import Express from 'express';
import pg from 'pg';

import { FileWorker } from '@src/business/file';
import { FileRepository } from '@src/data';
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
    req: Express.Request,
    res: Express.Response
  ) => {
    const { url, user } = req.body;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      this.pluginManager!
    );
    const resultWorker = await fileWorker.downloadFile(url, user);
    return res
      .status(resultWorker.httpCode)
      .json({ ...resultWorker.payload, code: resultWorker.code });
  };

  public getFilesByUser = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const { user } = req.body;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      this.pluginManager!
    );
    const resultWorker = await fileWorker.getFilesByUser(user);
    return res
      .status(resultWorker.httpCode)
      .json([{ ...resultWorker.payload, code: resultWorker.code }]);
  };

  public getFileSources = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      this.pluginManager!
    );
    const resultWorker = await fileWorker.getFileSources();
    return res
      .status(resultWorker.httpCode)
      .json({ ...resultWorker.payload, code: resultWorker.code });
  };

  public getPictureBySourceId = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const { sourceId } = req.params;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool, this.sqlManager),
      this.pluginManager!
    );
    const resultWorker = await fileWorker.getPictureBySourceId(sourceId);
    const { logoPath } = resultWorker.payload as { logoPath: string };
    return res
      .status(resultWorker.httpCode)
      .sendFile(this.config.appPathStorage + '/pictures/' + logoPath);
  };
}

export { FileController };
