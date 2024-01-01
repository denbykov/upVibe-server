import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { dataLogger } from '@src/utils/server/logger';

export class TagWorker {
  private db: iTagDatabase;
  private config: Config;
  constructor(db: iTagDatabase, config: Config) {
    this.db = db;
    this.config = config;
    dataLogger.trace('TagWorker initialized');
  }
  public getFileTags = async (fileId: number): Promise<Response> => {
    dataLogger.trace('TagWorker.getFileTags()');
    const tags = await this.db.getFileTags(fileId);
    if (tags) {
      return new Response(Response.Code.Ok, { tags });
    }
    return new Response(Response.Code.NotFound, 'No tags found', 1);
  };

  public getFilePictureTag = async (tagId: number): Promise<Response> => {
    dataLogger.trace('TagWorker.getFilePictureTag()');
    const picturePath = await this.db.getFilePictureTag(tagId);
    if (picturePath) {
      return new Response(Response.Code.Ok, picturePath);
    }
    return new Response(Response.Code.NotFound, 'No picture found', 1);
  };

  public getTagSources = async (): Promise<Response> => {
    dataLogger.trace('TagWorker.getTagSources()');
    const sources = await this.db.getTagSources();
    if (sources) {
      return new Response(Response.Code.Ok, { sources });
    }
    return new Response(Response.Code.NotFound, 'No sources found', 1);
  };

  public getTagSourcePicture = async (sourceId: number): Promise<Response> => {
    dataLogger.trace('TagWorker.getTagSourcePicture()');
    const picturePath = await this.db.getTagSourcePicture(sourceId);
    if (picturePath) {
      return new Response(Response.Code.Ok, picturePath);
    }
    return new Response(Response.Code.NotFound, 'No picture found', 1);
  };
}
