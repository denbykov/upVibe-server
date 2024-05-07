import { Logger } from 'log4js';

import { FileWorker } from './fileWorker';
import { TagMappingWorker } from './tagMappingWorker';
import { TagWorker } from './tagWorker';

class FileCoordinatorWorker {
  private fileWorker: FileWorker;
  private tagWorker: TagWorker;
  private tagMappingWorker: TagMappingWorker;
  private logger: Logger;
  constructor(
    fileWorker: FileWorker,
    tagWorker: TagWorker,
    tagMappingWorker: TagMappingWorker,
    logger: Logger
  ) {
    this.fileWorker = fileWorker;
    this.tagWorker = tagWorker;
    this.tagMappingWorker = tagMappingWorker;
    this.logger = logger;
  }

  public coordinateFile = async (
    fileId: string,
    userId: string
  ): Promise<void> => {
    const isDownloaded = await this.fileWorker.findFileAndCheckStatus(fileId);
    if (isDownloaded) {
      const tags = await this.tagWorker.getTagByFileId(fileId);
      const validTags = tags.filter((tag) => {
        return this.tagWorker.validateTagStatus(tag);
      });

      if (validTags.length === 0) {
        this.logger.info(`No valid tags found for file: ${fileId}`);
        return;
      }

      const tagMapping = await this.tagMappingWorker.getTagMappingByFileId(
        userId,
        fileId
      );

      if (tagMapping.fixed) {
        this.logger.info(`Tag mapping is fixed for file: ${fileId}`);
        return;
      }

      const tagsMappingPriority =
        await this.tagMappingWorker.getTagsMappingPriorityByUserId(userId);

      const newTagMapping =
        this.tagMappingWorker.mapTagMappingByMappingPriority(
          tagsMappingPriority,
          tagMapping,
          validTags
        );

      // TODO: Implement with device id
      await this.fileWorker.updateFileSynchronization(
        'ee7db5b1-d569-40f1-bda0-76d970b3b348',
        fileId,
        true
      );

      await this.tagMappingWorker.updateTagMappingById(newTagMapping);
    }
  };
}

export { FileCoordinatorWorker };
