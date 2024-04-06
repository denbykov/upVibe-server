import { TagMapping } from '@src/entities/tagMapping';
import { TagMappingPriority } from '@src/entities/tagMappingPriority';
import { iTagMappingDatabase } from '@src/interfaces/iTagMappingDatabase';

import { ProcessingError } from './processingError';

class TagMappingWorker {
  private db: iTagMappingDatabase;

  constructor(db: iTagMappingDatabase) {
    this.db = db;
  }

  public getTagMappingPriority = async (
    userId: number
  ): Promise<TagMappingPriority> => {
    const doesTagMappingPriorityExist =
      await this.db.doesTagMappingPriorityExist(userId);
    if (!doesTagMappingPriorityExist) {
      throw new ProcessingError('Tag mapping priority does not exist');
    }
    const tagMappingDTO = await this.db.getTagMappingPriority(userId);
    return tagMappingDTO.toEntity();
  };

  public getTagMapping = async (fileId: number): Promise<TagMapping> => {
    const doesTagMappingExist = await this.db.doesTagMappingExist(fileId);
    if (!doesTagMappingExist) {
      throw new ProcessingError('Tag mapping does not exist');
    }
    const tagMappingDTO = await this.db.getTagMapping(fileId);
    return tagMappingDTO.toEntity();
  };

  public insertTagMappingPriority = async (
    tagMappingPriority: TagMappingPriority
  ): Promise<TagMappingPriority> => {
    // await this.db.insertTagMappingPriority(tagMappingPriorityDTO);
    return tagMappingPriority;
  };
}

export { TagMappingWorker };
