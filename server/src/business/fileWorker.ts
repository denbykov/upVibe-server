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

  public getSources = async () => {
    dataLogger.trace('FileWorker.getSources()');
    const sources = await this.db.getSources();

    if (sources) {
      sources.map((source: JSON.JSONObject) => {
        delete source.image_path;
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
    const data = await this.db.getSource(sourceId);
    if (data) {
      const imagePath = data.image_path;
      return new Response(Response.Code.Ok, imagePath);
    }
    return new Response(Response.Code.NotFound, 'No picture found', 1);
  };
}
