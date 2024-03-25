import { TagSource } from '@src/entities/source';
import { Tag } from '@src/entities/tag';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';
import { dataLogger } from '@src/utils/server/logger';

import { ProcessingError } from './processingError';

export class TagWorker {
  private db: iTagDatabase;
  private tagPlugin: iTagPlugin;

  constructor(db: iTagDatabase, tagPlugin: iTagPlugin) {
    this.db = db;
    this.tagPlugin = tagPlugin;
    dataLogger.trace('TagWorker initialized');
  }
  public getFileTags = async (fileId: number): Promise<Array<Tag>> => {
    const tags = await this.db.getFileTags(fileId);
    return tags.map((tag) => {
      return tag.toEntity();
    });
  };

  public getSources = async (): Promise<Array<TagSource>> => {
    const sources = await this.db.getTagSources();
    return sources.map((source) => {
      return source.toEntity();
    });
  };

  public getSourceLogo = async (sourceId: number): Promise<string> => {
    const source = await this.db.getTagSource(sourceId);

    if (!source) {
      throw new ProcessingError('Source not found');
    }
    return source.logoPath;
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
    const tagSources = await this.getSources();
    tagSources.map((tagSource) => {
      if (tagSource.source !== 'youtube') {
        return this.tagPlugin.parseTags(fileId, tagSource.source);
      }
    });
    return this.getFileTags(fileId);
  };
}
