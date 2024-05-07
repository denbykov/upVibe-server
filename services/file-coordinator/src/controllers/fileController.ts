import { FileCoordinatorWorker } from '@business/fileCoordinatorWorker';
import { FileWorker } from '@business/fileWorker';
import { TagMappingWorker } from '@business/tagMappingWorker';
import { TagWorker } from '@business/tagWorker';
import { SQLManager } from '@core/sqlManager';
import { FileRepository } from '@data/fileRepository';
import { TagMappingRepository } from '@data/tagMappingRepository';
import { TagRepository } from '@data/tagRepository';
import { Message } from 'amqplib';
import { Logger } from 'log4js';
import pg from 'pg';

class FileController {
  private controllerLogger: Logger;
  private businessLogger: Logger;
  private dataLogger: Logger;
  private dbPool: pg.Pool;
  private sqlManager: SQLManager;
  constructor(
    logger: Logger,
    businessLogger: Logger,
    dataLogger: Logger,
    dbPool: pg.Pool,
    sqlManager: SQLManager
  ) {
    this.controllerLogger = logger;
    this.businessLogger = businessLogger;
    this.dataLogger = dataLogger;
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
  }
  public buildFileWorker = (): FileWorker => {
    return new FileWorker(
      new FileRepository(this.dbPool, this.sqlManager, this.dataLogger),
      this.businessLogger
    );
  };

  public buildTagWorker = (): TagWorker => {
    return new TagWorker(
      new TagRepository(this.dbPool, this.sqlManager, this.dataLogger),
      this.businessLogger
    );
  };

  public buildTagMappingWorker = (): TagMappingWorker => {
    return new TagMappingWorker(
      new TagMappingRepository(this.dbPool, this.sqlManager, this.dataLogger),
      this.businessLogger
    );
  };

  public buildFileCoordinatorWorker = (): FileCoordinatorWorker => {
    return new FileCoordinatorWorker(
      this.buildFileWorker(),
      this.buildTagWorker(),
      this.buildTagMappingWorker(),
      this.businessLogger
    );
  };

  public handle_message = async (message: Message): Promise<void> => {
    try {
      const { fileId, userId } = JSON.parse(message.content.toString());
      if (!fileId || !userId) {
        this.controllerLogger.error(
          `Invalid message - ${message.content.toString()}`
        );
        return;
      }
      await this.coordinateFile(fileId, userId);
    } catch (error) {
      this.controllerLogger.error(`Error handling message: ${error}`);
      return;
    }
  };

  public coordinateFile = async (
    fileId: string,
    userId: string
  ): Promise<void> => {
    this.controllerLogger.info(`Processing file ${fileId} for user ${userId}`);
    const fileCoordinatorWorker = this.buildFileCoordinatorWorker();
    try {
      await fileCoordinatorWorker.coordinateFile(fileId, userId);
    } catch (error) {
      this.controllerLogger.error(`Error coordinating file: ${error}`);
      throw new Error(`Error coordinating file: ${error}`);
    }
  };
}

export { FileController };
