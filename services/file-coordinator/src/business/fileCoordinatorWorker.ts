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

  public processFile = async (fileId: string): Promise<void> => {
    const file = await this.db.getFileById(fileId);
    const isDownloaded = file.status === Status.Downloaded;

    if (!isDownloaded) {
      return;
    }
    const tags = await this.db.getTagsByFileId(fileId);

    if (tags.length <= 1) {
      return;
    }

    if (
      !tags.every(
        (tag) => tag.status === Status.Completed || tag.status === Status.Error,
      )
    ) {
      return;
    }

    const tagsMappings = await this.db.getTagsMappingByFileId(fileId);

    if (tagsMappings.length === 0) {
      return;
    }

    const tagMappingsPriority = await this.db.getTagMappingsPriorityByUserId(
      tagsMappings[0].userId!,
    );

    const newTagMapping = this.mapTagMappingByMappingPriority(
      tagMappingsPriority,
      tagsMappings,
      tags,
    );

    const userFileId = await this.db.getUserFileIdByFileId(
      fileId,
      newTagMapping.userId!,
    );

    await this.db.updateTagMappingById(newTagMapping);

    this.logger.debug(
      `Updating tag mapping: ${newTagMapping} for file: ${fileId} and user: ${newTagMapping.userId}`,
    );

    await this.db.updateFileSynchronization(userFileId, true);
  };

  public mapTagMappingByMappingPriority = (
    tagMappingPriority: TagMappingPriorityDTO,
    tagsMappings: TagMappingDTO[],
    tags: TagDTO[],
  ): TagMappingDTO => {
    const mapTagsByPriority = (tags: TagDTO[], mappings: string[]): string => {
      const priorityTag = mappings.map((priority) => {
        const tag = tags.find((tag) => tag.source === priority);
        return tag?.source;
      })[0];

      return priorityTag ? priorityTag : mappings[0];
    };

    const mapping = new TagMappingDTO(
      tagsMappings[0].id,
      tagsMappings[0].userId,
      tagsMappings[0].fileId,
      mapTagsByPriority(tags, tagMappingPriority.title),
      mapTagsByPriority(tags, tagMappingPriority.artist),
      mapTagsByPriority(tags, tagMappingPriority.album),
      mapTagsByPriority(tags, tagMappingPriority.picture),
      mapTagsByPriority(tags, tagMappingPriority.year),
      mapTagsByPriority(tags, tagMappingPriority.trackNumber),
      true,
    );

    return mapping;
  };
}

export { FileCoordinatorWorker };
