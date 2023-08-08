import { Response } from '@src/entities/response';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { dataLogger } from '@src/utils/server/logger';

export class FileWorker {
  private db: iFileDatabase;
  private config: JSON.JSONObject;
  constructor(db: iFileDatabase, config: JSON.JSONObject) {
    this.db = db;
    this.config = config;
    dataLogger.trace('FileWorker initialized');
  }

  public getFiles = async (userId: number) => {
    dataLogger.trace('FileWorker.getFiles()');
    const files = await this.db.getFiles(userId);
    if (files) {
      return new Response(Response.Code.Ok, { files });
    }
    return new Response(Response.Code.NotFound, 'No files found', 1);
  };

  public getFileSources = async () => {
    dataLogger.trace('FileWorker.getFileSources()');
    const sources = await this.db.getFileSources();

    if (sources) {
      sources.map((source: JSON.JSONObject) => {
        delete source.imagePath;
        delete Object.assign(source, { ['source']: source.description })[
          'description'
        ];
      });

      return new Response(Response.Code.Ok, { sources });
    }
    return new Response(Response.Code.NotFound, 'No sources found', 1);
  };

  public getFileSourcePicture = async (sourceId: number) => {
    dataLogger.trace('FileWorker.getPicture()');
    const data = await this.db.getFileSource(sourceId);
    if (data) {
      return new Response(Response.Code.Ok, data.imagePath);
    }
    return new Response(Response.Code.NotFound, 'No picture found', 1);
  };
}
