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

  // FixMe: reimplement this function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public parseTags = async (fileId: number): Promise<Array<Tag>> => {
    // const tagSources = await this.getSources();
    // tagSources.map((tagSource) => {
    //   if (tagSource.source !== 'youtube') {
    //     return this.tagPlugin.parseTags(fileId, tagSource.source);
    //   }
    // });
    // return this.getFileTags(fileId);
    return Array<Tag>();
  };
}
