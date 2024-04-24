import { TagMapping } from '@src/entities/tagMapping';
import { TagMappingPriority } from '@src/entities/tagMappingPriority';
import { iTagMappingDatabase } from '@src/interfaces/iTagMappingDatabase';
import { TagMappingMapper } from '@src/mappers/tagMappingMapper';
import { TagMappingPriorityMapper } from '@src/mappers/tagMappingPriorityMapper';

import { ProcessingError } from './processingError';

// import { ProcessingError } from './processingError';

class TagMappingWorker {
  private db: iTagMappingDatabase;

  constructor(db: iTagMappingDatabase) {
    this.db = db;
  }

  // public getTagMappingPriority = async (
  // userId: string
  // ): Promise<TagMappingPriority> => {
  //   const doesTagMappingPriorityExist =
  //     await this.db.doesTagMappingPriorityExist(userId);
  //   if (!doesTagMappingPriorityExist) {
  //     throw new ProcessingError('Tag mapping priority does not exist');
  //   }
  //   const tagMappingDTO = await this.db.getTagMappingPriority(userId);
  //   return tagMappingDTO.toEntity();
  // };

  // public getTagMapping = async (fileId: string): Promise<TagMapping> => {
  //   const doesTagMappingExist = await this.db.doesTagMappingExist(fileId);
  //   if (!doesTagMappingExist) {
  //     throw new ProcessingError('Tag mapping does not exist');
  //   }
  //   const tagMappingDTO = await this.db.getTagMapping(fileId);
  //   return tagMappingDTO.toEntity();
  // };

  public getTagMappingPriority = async (
    userId: string
  ): Promise<TagMappingPriority> => {
    try {
      const tagMappingPriorityDTO = await this.db.getTagMappingPriority(userId);
      if (!tagMappingPriorityDTO) {
        throw new ProcessingError('Tag mapping priority does not exist');
      }
      return new TagMappingPriorityMapper().toEntity(tagMappingPriorityDTO);
    } catch (error) {
      throw new ProcessingError('Failed to get tag mapping priority');
    }
  };

  public updateTagMapping = async (
    tagMapping: TagMapping,
    fileId: string
  ): Promise<TagMapping> => {
    try {
      const tagMappingDTO = new TagMappingMapper().toDTO(tagMapping);
      return new TagMappingMapper().toEntity(
        await this.db.updateTagMapping(tagMappingDTO, fileId)
      );
    } catch (error) {
      throw new ProcessingError('Failed to update tag mapping');
    }
  };

  // public updateTagMappingPriority = async (
  //   tagMappingPriority: TagMappingPriority,
  //   userId: string
  // ): Promise<TagMappingPriority> => {
  //   const tagMappingPriorityDTO =
  //     TagMappingPriorityDTO.fromEntity(tagMappingPriority);
  //   return (
  //     await this.db.updateTagMappingPriority(tagMappingPriorityDTO, userId)
  //   ).toEntity();
  // };
}

export { TagMappingWorker };
