import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';
import { Status } from '@entities/status';
import { FileCoordinatorDatabase } from '@interfaces/fileCoordinatorDatabase';
import { ServerAgent } from '@interfaces/serverAgent';
import { Logger } from 'log4js';

class FileCoordinatorWorker {
  private db: FileCoordinatorDatabase;
  private serverAgent: ServerAgent;
  private logger: Logger;
  constructor(db: FileCoordinatorDatabase, serverAgent: ServerAgent, logger: Logger) {
    this.db = db;
    this.serverAgent = serverAgent;
    this.logger = logger;
  }

  public processFile = async (fileId: string): Promise<void> => {
    const file = await this.db.getFileById(fileId);

    if (file.status !== Status.Downloaded && file.status !== Status.Completed) {
      return;
    }

    const tags = await this.db.getTagsByFileId(fileId);
    if (tags.length == 0) {
      return;
    }

    if (tags.length == 1) {
      await this.serverAgent.requestFileTagging(fileId);
      return;
    }

    if (
      !tags.every(
        (tag) => tag.status === Status.Completed || tag.status === Status.Error,
      )
    ) {
      return;
    }

    const tagMappings = await this.db.getTagMappings(fileId, false);

    for (const tagMapping of tagMappings) {
        const tagMappingPriority = await this.db.getTagMappingPriority(
        tagMapping.userId!,
      );

      const newTagMapping = this.rebuildTagMapping(
        tagMapping,
        tagMappingPriority,
        tags,
      );

      await this.db.updateTagMapping(newTagMapping);

      const userFileId = await this.db.getUserFileId(
        fileId,
        newTagMapping.userId!,
      );

      await this.db.updateFileSynchronization(userFileId, false);
    }

    if (file.status === Status.Downloaded) {
      this.db.updateFileStatus(fileId, Status.Completed);
      file.status = Status.Completed;
    }
  };

  public rebuildTagMapping = (
    originalMapping: TagMappingDTO,
    tagMappingPriority: TagMappingPriorityDTO,
    tags: TagDTO[],
  ): TagMappingDTO => {
    const getMostRelevantTag = (tags: TagDTO[], sources: string[]): string => {
      for (const source of sources) {
        const tag = tags.find((tag) => tag.source === source);
        if (tag) {
          return tag.source;
        }
      }

      return tags.find((tag) => tag.isPrimary)!.source;
    };

    const mapping = new TagMappingDTO(
      originalMapping.id,
      originalMapping.userId,
      originalMapping.fileId,
      getMostRelevantTag(tags, tagMappingPriority.title),
      getMostRelevantTag(tags, tagMappingPriority.artist),
      getMostRelevantTag(tags, tagMappingPriority.album),
      getMostRelevantTag(tags, tagMappingPriority.picture),
      getMostRelevantTag(tags, tagMappingPriority.year),
      getMostRelevantTag(tags, tagMappingPriority.trackNumber),
      true,
    );

    return mapping;
  };
}

export { FileCoordinatorWorker };
