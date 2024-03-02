import Express from 'express';
import pg from 'pg';

import { TagWorker } from '@src/business/tag';
import { TagRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

import { BaseController } from './base';

class TagController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool, sqlManager: SQLManager) {
    super(config, databasePool, sqlManager);
  }

  public getFileTags = async (req: Express.Request, res: Express.Response) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool),
      this.config
    );
    const fileId = Number(req.params.fileId);
    const tags = await tagWorker.getFileTags(fileId);
    dataLogger.trace(`TagController.getFileTags: ${tags}`);
    return res.status(tags.httpCode).json([tags.payload, tags.code]);
  };

  public getFilePictureTag = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool),
      this.config
    );
    const tagId = Number(req.params.tagId);
    const picturePath = await tagWorker.getFilePictureTag(tagId);
    dataLogger.trace(`TagController.getFilePictureTag: ${picturePath}`);
    if (picturePath.httpCode === 200) {
      return res
        .status(picturePath.httpCode)
        .sendFile(
          `${this.config.appPathStorage}/${picturePath.payload}`,
          (err) => {
            if (err) {
              dataLogger.warn(`TagController.getFilePictureTag: ${err}`);
              return res.status(400).send('Bad request');
            }
          }
        );
    }
    return res
      .status(picturePath.httpCode)
      .json([picturePath.payload, picturePath.code]);
  };

  public getTagSources = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool),
      this.config
    );
    const sources = await tagWorker.getTagSources();
    dataLogger.trace(`TagController.getTagSources: ${sources}`);
    return res.status(sources.httpCode).json([sources.payload, sources.code]);
  };

  public getTagSourcePicture = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool),
      this.config
    );
    const sourceId = Number(req.params.sourceId);
    const picturePath = await tagWorker.getTagSourcePicture(sourceId);
    dataLogger.trace(`TagController.getTagSourcePicture: ${picturePath}`);
    if (picturePath.httpCode === 200) {
      return res
        .status(picturePath.httpCode)
        .sendFile(
          `${this.config.appPathStorage}/${picturePath.payload}`,
          (err) => {
            if (err) {
              dataLogger.warn(`TagController.getTagSourcePicture: ${err}`);
              return res.status(400).send('Bad request');
            }
          }
        );
    }
    return res
      .status(picturePath.httpCode)
      .json([picturePath.payload, picturePath.code]);
  };
}

export { TagController };
