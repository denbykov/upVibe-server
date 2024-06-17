import { Tag } from '@src/entities/tag';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { TagMapper } from '@src/mappers/tagMapper';
import { dataLogger } from '@src/utils/server/logger';

import { ProcessingError } from './processingError';

export class TagWorker {
  private db: iTagDatabase;
  private fileDb: iFileDatabase;

  constructor(db: iTagDatabase, fileDb: iFileDatabase) {
    this.db = db;
    this.fileDb = fileDb;
    dataLogger.trace('TagWorker initialized');
  }

  public getFileTags = async (fileId: string): Promise<Array<Tag>> => {
    const doesFileExist = await this.fileDb.doesFileExist(fileId);
    if (!doesFileExist) {
      throw new ProcessingError('File not found');
    }
    const tags = await this.db.getFileTags(fileId);
    return tags.map((tag) => {
      return new TagMapper().toEntity(tag);
    });
  };

  public getPictureOfTag = async (tagId: string): Promise<string> => {
    const tag = await this.db.getTag(tagId);

    if (!tag) {
      throw new ProcessingError('Tag not found');
    }

    if (!tag.picturePath) {
      throw new ProcessingError('Tag has no picture');
    }

    return tag.picturePath;
  };

  public parseTags = async (fileId: string): Promise<Array<Tag>> => {
    return this.getFileTags(fileId);
  };
}
