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

  public getFileTags = async (
    request: Express.Request,
    result: Express.Response
  ) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool, this.sqlManager)
    );
    const fileId = Number(request.params.fileId);
    const tags = await tagWorker.getFileTags(fileId);
    dataLogger.trace(`TagController.getFileTags: ${tags}`);
    return result.status(tags.httpCode).json([tags.payload, tags.code]);
  };

  public getFilePictureTag = async (
    request: Express.Request,
    result: Express.Response
  ) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool, this.sqlManager)
    );
    const tagId = Number(request.params.tagId);
    const picturePath = await tagWorker.getFilePictureTag(tagId);
    dataLogger.trace(`TagController.getFilePictureTag: ${picturePath}`);
    if (picturePath.httpCode === 200) {
      return result
        .status(picturePath.httpCode)
        .sendFile(
          `${this.config.appPathStorage}/${picturePath.payload}`,
          (err) => {
            if (err) {
              dataLogger.warn(`TagController.getFilePictureTag: ${err}`);
              return result.status(400).send('Bad request');
            }
          }
        );
    }
    return result
      .status(picturePath.httpCode)
      .json([picturePath.payload, picturePath.code]);
  };

  public getTagSources = async (
    request: Express.Request,
    result: Express.Response
  ) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool, this.sqlManager)
    );
    const sources = await tagWorker.getTagSources();
    dataLogger.trace(`TagController.getTagSources: ${sources}`);
    return result
      .status(sources.httpCode)
      .json([sources.payload, sources.code]);
  };

  public getTagSourcePicture = async (
    request: Express.Request,
    result: Express.Response
  ) => {
    const tagWorker = new TagWorker(
      new TagRepository(this.databasePool, this.sqlManager)
    );
    const sourceId = Number(request.params.sourceId);
    const picturePath = await tagWorker.getTagSourcePicture(sourceId);
    dataLogger.trace(`TagController.getTagSourcePicture: ${picturePath}`);
    if (picturePath.httpCode === 200) {
      return result
        .status(picturePath.httpCode)
        .sendFile(
          `${this.config.appPathStorage}/${picturePath.payload}`,
          (err) => {
            if (err) {
              dataLogger.warn(`TagController.getTagSourcePicture: ${err}`);
              return result.status(400).send('Bad request');
            }
          }
        );
    }
    return result
      .status(picturePath.httpCode)
      .json([picturePath.payload, picturePath.code]);
  };
}

export { TagController };
