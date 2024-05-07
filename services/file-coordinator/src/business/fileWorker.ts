import { FileDTO } from '@dtos/fileDTO';
import { Status } from '@entities/status';
import { FileDatabase } from '@interfaces/fileDatabase';
import { Logger } from 'log4js';

class FileWorker {
  private db: FileDatabase;
  private logger: Logger;
  constructor(db: FileDatabase, logger: Logger) {
    this.db = db;
    this.logger = logger;
  }

  public verifyFileStatus = (file: FileDTO): boolean => {
    if (file.status === Status.Downloaded) {
      return true;
    }
    return false;
  };

  public findFileAndCheckStatus = async (id: string): Promise<boolean> => {
    const file = await this.db.getFileById(id);
    const isDownloaded = this.verifyFileStatus(file!);
    if (isDownloaded) {
      this.logger.info(`File ${id} is downloaded`);
      return true;
    } else {
      this.logger.info(`File ${id} is not downloaded`);
      return false;
    }
  };

  public updateFileSynchronization = async (
    deviceId: string,
    userFileId: string,
    isSynchronized: boolean
  ): Promise<void> => {
    await this.db.updateFileSynchronization(deviceId, userFileId, isSynchronized);
  };
}

export { FileWorker };
