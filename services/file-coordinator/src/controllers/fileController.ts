import { Message } from 'amqplib';
import { Logger } from 'log4js';
import pg from 'pg';
import { PluginManager } from '@core/pluginManager';
import { SQLManager } from '@core/sqlManager';
import { FileCoordinatorWorker } from '@business/fileCoordinatorWorker';
import { FileCoordinatorRepository } from '@data/fileCoordinatorRepository';
import { FileRepository } from '@data/fileRepository';
import { PlaylistRepository } from '@data/playlistRepository';
import { ServerAgentImpl } from '@data/serverAgent';
import { SourceRepository } from '@data/sourceRepository';
import { TagRepository } from '@data/tagRepository';

class FileController {
  private controllerLogger: Logger;
  private businessLogger: Logger;
  private dataLogger: Logger;
  private dbPool: pg.Pool;
  private sqlManager: SQLManager;
  private pluginManager: PluginManager;
  private uvServerHost: string;
  private uvServerPort: number;
  constructor(
    logger: Logger,
    businessLogger: Logger,
    dataLogger: Logger,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager: PluginManager,
    uvServerHost: string,
    uvServerPort: number,
  ) {
    this.controllerLogger = logger;
    this.businessLogger = businessLogger;
    this.dataLogger = dataLogger;
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.pluginManager = pluginManager;
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
      new FileRepository(this.dbPool, this.sqlManager, this.dataLogger),
      new TagRepository(this.dbPool, this.sqlManager, this.dataLogger),
      new SourceRepository(this.dbPool, this.sqlManager, this.dataLogger),
      new PlaylistRepository(this.dbPool, this.sqlManager, this.dataLogger),
      new ServerAgentImpl(
        this.uvServerHost,
        this.uvServerPort,
        this.dataLogger,
      ),
      this.pluginManager!.getFilePlugin(),
      this.pluginManager!.getTagPlugin(),
      this.businessLogger,
    );
  };

  public handle_message = async (
    queueName: string,
    message: Message,
  ): Promise<void> => {
    try {
      if (!message.content) {
        this.controllerLogger.error('Invalid message');
        return;
      }
      const messageContent = JSON.parse(message.content.toString());
      await this.coordinateFile(queueName, messageContent);
    } catch (error) {
      this.controllerLogger.error(`Error handling message: ${error}`);
      return;
    }
  };

  public coordinateFile = async (
    queueName: string,
    messageContent: JSON.JSONObject,
  ): Promise<void> => {
    const fileCoordinatorWorker = this.buildFileCoordinatorWorker();
    try {
      if (queueName === 'downloading/file') {
        const {
          url,
          user_id: userId,
          playlist_id: playlistId,
        } = messageContent;
        this.controllerLogger.info(
          `Processing file ${url}. Queue: ${queueName}`,
        );
        await fileCoordinatorWorker.downloadFile(url, userId, playlistId);
      } else if (queueName === 'checking/file') {
        const { file_id: fileId } = messageContent;
        this.controllerLogger.info(
          `Processing file ${fileId}. Queue: ${queueName}`,
        );
        await fileCoordinatorWorker.processFile(fileId);
      }
    } catch (error) {
      this.controllerLogger.error(`Error processing file: ${error}`);
      throw new Error(`Error processing file: ${error}`);
    }
  };
}

export { FileController };
