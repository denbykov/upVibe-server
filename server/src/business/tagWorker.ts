import { TagDTO } from '@src/dto/tagDTO';
import { Tag } from '@src/entities/tag';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';
import { dataLogger } from '@src/utils/server/logger';

import { ProcessingError } from './processingError';

export class TagWorker {
  private db: iTagDatabase;
  private tagPlugin: iTagPlugin;
  private sourceDb: iSourceDatabase;

  constructor(
    db: iTagDatabase,
    sourceDb: iSourceDatabase,
    tagPlugin: iTagPlugin
  ) {
    this.db = db;
    this.sourceDb = sourceDb;
    this.tagPlugin = tagPlugin;
    dataLogger.trace('TagWorker initialized');
  }
  public getFileTags = async (fileId: number): Promise<Array<Tag>> => {
    const tags = await this.db.getFileTags(fileId);
    return tags.map((tag) => {
      return tag.toEntity();
    });
  };

  public getPictureOfTag = async (tagId: number): Promise<string> => {
    const tag = await this.db.getTag(tagId);

    if (!tag) {
      throw new ProcessingError('Tag not found');
    }

    if (!tag.picturePath) {
      throw new ProcessingError('Tag has no picture');
    }

    return tag.picturePath;
  };

  public parseTags = async (fileId: number): Promise<Array<Tag>> => {
    await this.requestTagging(fileId);
    return this.getFileTags(fileId);
  };

  public requestTagging = async (fileId: number): Promise<void> => {
    const primaryTag = await this.db.getTagPrimary(fileId);

    if (!primaryTag) {
      throw new ProcessingError('Primary tag not found');
    }

    if (primaryTag.status !== 'C') {
      throw new ProcessingError('Primary tag is not parsed');
    }

    const sources = await this.sourceDb.getSourcesWithParsingPermission();
    await Promise.all(
      sources.map(async (source) => {
        if (!(await this.db.doesTagExist(fileId, source.id))) {
          await this.db.insertTag(
            TagDTO.allFromOneSource(0, fileId, false, source.id, 'CR')
          );
          await this.tagPlugin.parseTags(fileId, source.description);
        }
      })
    );
  };
}
