import { FileCoordinatorWorker } from '@business/fileCoordinatorWorker';
import { FileCoordinatorRepository } from '@data/fileCoordinatorRepository';
import { Message } from 'amqplib';
import { Logger } from 'log4js';
import pg from 'pg';
import { SQLManager } from '@core/sqlManager';
import { ServerAgentImpl } from '@data/serverAgent';

class FileController {
  private controllerLogger: Logger;
  private businessLogger: Logger;
  private dataLogger: Logger;
  private dbPool: pg.Pool;
  private sqlManager: SQLManager;
  private uvServerHost: string;
  private uvServerPort: number;
  constructor(
    logger: Logger,
    businessLogger: Logger,
    dataLogger: Logger,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    uvServerHost: string,
    uvServerPort: number,
  ) {
    this.controllerLogger = logger;
    this.businessLogger = businessLogger;
    this.dataLogger = dataLogger;
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.uvServerHost = uvServerHost;
    this.uvServerPort = uvServerPort;
  }
  public buildFileCoordinatorWorker = (): FileCoordinatorWorker => {
    return new FileCoordinatorWorker(
      new FileCoordinatorRepository(
        this.dbPool,
        this.sqlManager,
        this.dataLogger,
      ),
      new ServerAgentImpl(this.uvServerHost, this.uvServerPort, this.dataLogger),
      this.businessLogger,
    );
  };

  public handle_message = async (message: Message): Promise<void> => {
    try {
      const { file_id: fileId } = JSON.parse(message.content.toString());
      if (!fileId) {
        this.controllerLogger.error(
          `Invalid message - ${message.content.toString()}`,
        );
        return;
      }
      await this.coordinateFile(fileId);
    } catch (error) {
      this.controllerLogger.error(`Error handling message: ${error}`);
      return;
    }
  };

  public coordinateFile = async (fileId: string): Promise<void> => {
    this.controllerLogger.info(`Processing file ${fileId}`);
    const fileCoordinatorWorker = this.buildFileCoordinatorWorker();
    try {
      await fileCoordinatorWorker.processFile(fileId);
    } catch (error) {
      this.controllerLogger.error(`Error processing file: ${error}`);
      throw new Error(`Error processing file: ${error}`);
    }
  };
}

export { FileController };
