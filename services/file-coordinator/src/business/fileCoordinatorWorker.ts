import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';
import { Status } from '@entities/status';
import { FileCoordinatorDatabase } from '@interfaces/fileCoordinatorDatabase';
import { Logger } from 'log4js';

class FileCoordinatorWorker {
  private db: FileCoordinatorDatabase;
  private logger: Logger;
  constructor(db: FileCoordinatorDatabase, logger: Logger) {
    this.db = db;
    this.logger = logger;
  }

  public findFileAndCheckStatus = async (id: string): Promise<boolean> => {
    const file = await this.db.getFileById(id);
    return file.status === Status.Downloaded;
  };

  private findTagById = (tags: TagDTO[], id: string): TagDTO | undefined => {
    return tags.find((tag) => tag.id === id);
  };

  public mapTagMappingByMappingPriority = (
    tagMappingPriority: TagMappingPriorityDTO,
    tagMapping: TagMappingDTO,
    tags: TagDTO[]
  ): TagMappingDTO => {
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

  public validateTagStatus = (tag: TagDTO): boolean => {
    return tag.status === Status.Completed || tag.status === Status.Error;
  };

  public processFile = async (fileId: string): Promise<void> => {
    const isDownloaded = await this.findFileAndCheckStatus(fileId);

    if (!isDownloaded) {
      return;
    }
    const tags = await this.db.getTagsByFileId(fileId);

    if (!tags.every(this.validateTagStatus)) {
      return;
    }

    const tagMapping = await this.db.getTagMappingByFileId(fileId);

    if (tagMapping.fixed) {
      return;
    }

    const tagsMappingPriority = await this.db.getTagsMappingPriorityByUserId(
      tagMapping.userId!
    );

    const newTagMapping = this.mapTagMappingByMappingPriority(
      tagsMappingPriority,
      tagMapping,
      tags
    );

    const userFileId = await this.db.getUserFileIdByFileId(
      fileId,
      newTagMapping.userId!
    );

    await this.db.updateTagMappingById(newTagMapping);

    await this.db.updateFileSynchronization(userFileId, true);
  };
}

export { FileCoordinatorWorker };
