import { AMQPPublisher } from '@/core/AMQPPublisher';
import { Config } from '@/entities/config';
import { iFileCoordinatorPlugin } from '@/interface/iFileCoordinatorPlugin';
import { Logger } from 'log4js';

export default class FileCoordinatorPlugin extends AMQPPublisher implements iFileCoordinatorPlugin {
  protected dataLogger: Logger;
  pluginName: string = 'FileCoordinatorPlugin';
  constructor(envConfig:JSON.JSONObject, config: Config, dataLogger: Logger) {
    super(new Config(envConfig, config), dataLogger);
    this.dataLogger = dataLogger;
    this.dataLogger.info(
      `[${this.pluginName}] Plugin ${this.pluginName} loaded`
    );
  }
  public coordinateFile =  (fileId: string): void => {
    this.dataLogger.info(`[${this.pluginName}] Coordinating file: ${fileId}`);
    try {
      this.publish('checking/file', {
        file_id: fileId
      });
    } catch (error) {
      this.dataLogger.error(error);
      throw error;
    }
  }
}
