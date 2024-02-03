import Express from 'express';
import pg from 'pg';

import { FileWorker } from '@src/business/fileWorker';
import { FileRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { iPluginManager } from '@src/interfaces/iPluginManager';

import { BaseController } from './base';

class FileController extends BaseController {
  constructor(
    config: Config,
    databasePool: pg.Pool,
    pluginManager?: iPluginManager
  ) {
    super(config, databasePool, pluginManager);
  }

  public downloadFileBySource = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const { url, user } = req.body;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool),
      this.pluginManager!
    );
    const task = await fileWorker.manageFileDownload(url, user);
    return res.status(task.httpCode).send(task.serialize());
  };

  public getFilesByUser = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const { user } = req.body;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool),
      this.pluginManager!
    );
    const task = await fileWorker.getFilesByUser(user);
    return res.status(task.httpCode).send(task.serialize());
  };

  public getFileById = async (req: Express.Request, res: Express.Response) => {
    const { fileId } = req.params;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool),
      this.pluginManager!
    );
    const task = await fileWorker.getFileById(fileId);
    return res.status(task.httpCode).send(task.serialize());
  };

  public getFileSources = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool),
      this.pluginManager!
    );
    const task = await fileWorker.getFileSources();
    return res.status(task.httpCode).send(task.serialize());
  };

  public getPictureBySourceId = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const { sourceId } = req.params;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool),
      this.pluginManager!
    );
    const task = await fileWorker.getPictureBySourceId(sourceId);
    return res.status(task.httpCode).send(task.serialize());
  };
}

export { FileController };
