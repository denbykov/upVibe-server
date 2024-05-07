import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';
import { TagMappingDatabase } from '@interfaces/tagMappingDatabase';
import { Logger } from 'log4js';

class TagMappingWorker {
  private db: TagMappingDatabase;
  private logger: Logger;
  constructor(db: TagMappingDatabase, logger: Logger) {
    this.db = db;
    this.logger = logger;
  }

  public getTagMappingByFileId = async (
    userId: string,
    fileId: string
  ): Promise<TagMappingDTO> => {
    this.logger.info(
      `Getting tags mapping by file id: ${fileId} by user: ${userId}`
    );
    return this.db.getTagMappingByFileId(userId, fileId);
  };

  public getTagsMappingPriorityByUserId = async (
    userId: string
  ): Promise<TagMappingPriorityDTO> => {
    this.logger.info(`Getting tags mapping priority by user id: ${userId}`);
    return this.db.getTagsMappingPriorityByUserId(userId);
  };

  private findTagById = (tags: TagDTO[], id: string): TagDTO | undefined => {
    return tags.find((tag) => tag.id === id);
  };

  public mapTagMappingByMappingPriority = (
    tagMappingPriority: TagMappingPriorityDTO,
    tagMapping: TagMappingDTO,
    tags: TagDTO[]
  ): TagMappingDTO => {
    this.logger.info(`Mapping tags by priority`);

    const findFirstTag = (ids: string[]): string => {
      const tag = ids.find((id) => {
        return this.findTagById(tags, id) !== undefined;
      });

      return tag || '';
    };

    const mapping = new TagMappingDTO(
      tagMapping.id,
      tagMapping.userId,
      tagMapping.fileId,
      findFirstTag(tagMappingPriority.title),
      findFirstTag(tagMappingPriority.artist),
      findFirstTag(tagMappingPriority.album),
      findFirstTag(tagMappingPriority.picture),
      findFirstTag(tagMappingPriority.year),
      findFirstTag(tagMappingPriority.trackNumber),
      true
    );

    return mapping;
  };

  public updateTagMappingById = async (
    tagMapping: TagMappingDTO
  ): Promise<void> => {
    this.logger.info(`Updating tag mapping by id: ${tagMapping.id}`);
    await this.db.updateTagMappingById(tagMapping);
  };
}

export { TagMappingWorker };
