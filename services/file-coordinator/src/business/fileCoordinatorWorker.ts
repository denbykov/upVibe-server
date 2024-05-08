import { FileDTO } from '@dtos/fileDTO';
import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';
import { Status } from '@entities/status';
import { FileCoordinatorDatabase } from '@interfaces/fileCoordinatorDatabase';
import { UUID } from 'crypto';
import { Logger } from 'log4js';

class FileCoordinatorWorker {
  private db: FileCoordinatorDatabase;
  private logger: Logger;
  constructor(db: FileCoordinatorDatabase, logger: Logger) {
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
    await this.db.updateFileSynchronization(
      deviceId,
      userFileId,
      isSynchronized
    );
  };

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

  public validateTagStatus = (tag: TagDTO): boolean => {
    this.logger.info(`Validating tag: ${tag.id}`);
    return tag.status === Status.Completed || tag.status === Status.Error;
  };

  public getTagByFileId = async (fileId: string): Promise<TagDTO[]> => {
    this.logger.info(`Getting tags by file id: ${fileId}`);
    return this.db.getTagByFileId(fileId);
  };

  public processFile = async (
    fileId: string,
    userId: string,
    deviceId: UUID
  ): Promise<void> => {
    const isDownloaded = await this.findFileAndCheckStatus(fileId);
    if (isDownloaded) {
      const tags = await this.getTagByFileId(fileId);
      const validTags = tags.filter((tag) => {
        return this.validateTagStatus(tag);
      });

      if (validTags.length === 0) {
        this.logger.info(`No valid tags found for file: ${fileId}`);
        return;
      }

      const tagMapping = await this.getTagMappingByFileId(userId, fileId);

      if (tagMapping.fixed) {
        this.logger.info(`Tag mapping is fixed for file: ${fileId}`);
        return;
      }

      const tagsMappingPriority =
        await this.getTagsMappingPriorityByUserId(userId);

      const newTagMapping = this.mapTagMappingByMappingPriority(
        tagsMappingPriority,
        tagMapping,
        validTags
      );

      await this.updateFileSynchronization(deviceId, fileId, true);

      await this.updateTagMappingById(newTagMapping);
    }
  };
}

export { FileCoordinatorWorker };
