import { TagDTO } from '@dtos/tagDTO';
import { Status } from '@entities/status';
import { TagDatabase } from '@interfaces/tagDatabase';
import { Logger } from 'log4js';

class TagWorker {
  private db: TagDatabase;
  private logger: Logger;
  constructor(db: TagDatabase, logger: Logger) {
    this.db = db;
    this.logger = logger;
  }

  public validateTagStatus = (tag: TagDTO): boolean => {
    this.logger.info(`Validating tag: ${tag.id}`);
    return tag.status === Status.Completed || tag.status === Status.Error;
  };

  public getTagByFileId = async (fileId: string): Promise<TagDTO[]> => {
    this.logger.info(`Getting tags by file id: ${fileId}`);
    return this.db.getTagByFileId(fileId);
  };
}

export { TagWorker };
