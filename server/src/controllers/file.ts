import Express from 'express';
import pg from 'pg';

import { FileWorker } from '@src/business/fileWorker';
import { FileRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iPluginManager } from '@src/interfaces/iPluginManager';
import { PluginManager } from '@src/pluginManager';

import { BaseController } from './base';

class FileController extends BaseController {
  private filePlugin: iFilePlugin;
  constructor(
    config: Config,
    databasePool: pg.Pool,
    pluginManager?: iPluginManager
  ) {
    super(config, databasePool, pluginManager);
    this.filePlugin = pluginManager!.getPlugin(
      PluginManager.PluginType.FilePlugin
    ) as iFilePlugin;
  }

  public downloadFileBySource = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const { url, user } = req.body;
    const fileWorker = new FileWorker(
      new FileRepository(this.databasePool),
      this.filePlugin
    );
    const task = await fileWorker.manageFileDownload(url, user);
    return res.status(task.httpCode).send(task.serialize());
  };
}

export { FileController };
