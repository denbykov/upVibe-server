import Express from 'express';
import { Logger } from 'log4js';
import pg from 'pg';

import { FileWorker } from '@src/business/fileWorker';
import { FileRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { dataLogger } from '@src/utils/server/logger';

import { BaseController } from './base';

// TODO: add plugin manager
class FileController extends BaseController {
  private filePlugin: Promise<iFilePlugin>;
  constructor(
    config: Config,
    databasePool: pg.Pool,
    plugins?: Promise<Map<string, any>>
  ) {
    super(config, databasePool, plugins);
    this.filePlugin = this.plugins!.then(
      (plugins) => new (plugins.get('FilePlugin') as any)(config, dataLogger)
    );
  }

  // public getFiles = async (req: Express.Request, res: Express.Response) => {
  //   const fileWorker = new FileWorker(
  //     await new FileRepository(this.databasePool),
  //     this.config
  //   );
  //   const token = req.headers.authorization?.split(' ')[1];
  //   const decodedToken = jwt.verify(
  //     <string>token,
  //     this.config.apiAccessTokenSecret
  //   ) as jwt.JwtPayload;
  //   const userId: number = decodedToken.userId;
  //   const files = await fileWorker.getFiles(userId);
  //   return res.status(files.httpCode).send(files.serialize());
  // };

  // public getFileSources = async (
  //   req: Express.Request,
  //   res: Express.Response
  // ) => {
  //   const fileWorker = new FileWorker(
  //     await new FileRepository(this.databasePool),
  //     this.config
  //   );
  //   const sources = await fileWorker.getFileSources();
  //   return res.status(sources.httpCode).send(sources.serialize());
  // };

  // public getFileSourcePicture = async (
  //   req: Express.Request,
  //   res: Express.Response
  // ) => {
  //   const fileWorker = new FileWorker(
  //     await new FileRepository(this.databasePool),
  //     this.config
  //   );
  //   const sourceId = Number(req.params.sourceId);
  //   const picture = await fileWorker.getFileSourcePicture(sourceId);
  //   if (picture.httpCode === 200) {
  //     return res
  //       .status(picture.httpCode)
  //       .sendFile(`${this.config.appPathStorage}/${picture.payload}`, (err) => {
  //         if (err) {
  //           dataLogger.warn(`FileController.getPicture: ${err}`);
  //           const errResponse = new Response(
  //             Response.Code.BadRequest,
  //             'Bad request',
  //             1
  //           );
  //           return res
  //             .status(errResponse.httpCode)
  //             .send(errResponse.serialize());
  //         } else {
  //           dataLogger.trace(`FileController.getPicture: ${picture.payload}`);
  //         }
  //       });
  //   }
  //   return res.status(picture.httpCode).send(picture.serialize());
  // };

  public downloadFileBySource = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const { url, user } = req.body;
    const fileWorker = new FileWorker(
      await new FileRepository(this.databasePool),
      this.config,
      await this.filePlugin
    );
    // const task = await fileWorker.downloadFileBySource(url);
    const task = await fileWorker.manageFileDownload(url, user);
    // return res.status(task.httpCode).send(task.serialize());

    // return res.status(200).send('ok');

    // const upload = await fileWorker.startFileDownloading(userId, sourceUrl);
    // return res.status(upload.httpCode).send(upload.serialize());
  };
}

export { FileController };
