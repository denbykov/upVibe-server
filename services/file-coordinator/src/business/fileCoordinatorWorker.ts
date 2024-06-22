import { Logger } from 'log4js';
import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';
import { Status } from '@entities/status';
import { FileCoordinatorDatabase } from '@interfaces/fileCoordinatorDatabase';
import { SourceDatabase } from '@interfaces/sourceDatabase';
import { TagDatabase } from '@interfaces/tagDatabase';
import { TagPlugin } from '@interfaces/tagPlugin';

class FileCoordinatorWorker {
  private db: FileCoordinatorDatabase;
  private tagDb: TagDatabase;
  private sourceDb: SourceDatabase;
  private tagPlugin: TagPlugin;
  private logger: Logger;
  constructor(
    db: FileCoordinatorDatabase,
    tagDb: TagDatabase,
    sourceDb: SourceDatabase,
    tagPlugin: TagPlugin,
    logger: Logger,
  ) {
    this.db = db;
    this.tagDb = tagDb;
    this.sourceDb = sourceDb;
    this.tagPlugin = tagPlugin;
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
      const tag = tags[0];
      if (tag.status === Status.Completed) {
        this.logger.info(`Requesting tagging for file ${fileId}`);
        await this.requestTagging(fileId);
      }
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
    const getMostRelevantTag = (
      tags: TagDTO[],
      sources: string[],
      // eslint-disable-next-line @typescript-eslint/ban-types
      tagSatisfies: Function,
    ): string => {
      for (const source of sources) {
        const tag = tags.find((tag) => tag.source === source);
        if (tag && tagSatisfies(tag)) {
          return tag.source;
        }
      }

      return tags.find((tag) => tag.isPrimary)!.source;
    };

    const mapping = new TagMappingDTO(
      originalMapping.id,
      originalMapping.userId,
      originalMapping.fileId,
      getMostRelevantTag(
        tags,
        tagMappingPriority.title,
        (tag: TagDTO) => tag.title !== null,
      ),
      getMostRelevantTag(
        tags,
        tagMappingPriority.artist,
        (tag: TagDTO) => tag.artist !== null,
      ),
      getMostRelevantTag(
        tags,
        tagMappingPriority.album,
        (tag: TagDTO) => tag.album !== null,
      ),
      getMostRelevantTag(
        tags,
        tagMappingPriority.picture,
        (tag: TagDTO) => tag.picturePath !== null,
      ),
      getMostRelevantTag(
        tags,
        tagMappingPriority.year,
        (tag: TagDTO) => tag.year !== null,
      ),
      getMostRelevantTag(
        tags,
        tagMappingPriority.trackNumber,
        (tag: TagDTO) => tag.trackNumber !== null,
      ),
      true,
    );

    return mapping;
  };

  public requestTagging = async (fileId: string): Promise<void> => {
    const primaryTag = await this.tagDb.getPrimaryTag(fileId);

    if (!primaryTag) {
      throw Error('Primary tag not found');
    }

    if (primaryTag.status !== 'C') {
      throw Error('Primary tag is not parsed');
    }

    const sources = await this.sourceDb.getSourcesWithParsingPermission();
    await Promise.all(
      sources.map(async (source) => {
        if (await this.tagDb.getTagByFile(fileId, source.id)) {
          throw Error('Parsing already requested');
        }
        await this.tagDb.insertTag(
          TagDTO.allFromOneSource('0', fileId, false, source.id, 'CR'),
        );
        await this.tagPlugin.parseTags(fileId, source.description);
      }),
    );
  };
}

export { FileCoordinatorWorker };
