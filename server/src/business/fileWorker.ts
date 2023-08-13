import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { dataLogger } from '@src/utils/server/logger';
import { parseURLYouTube } from '@src/utils/server/parseURLYouTube';

export class FileWorker {
  private db: iFileDatabase;
  private config: Config;
  constructor(db: iFileDatabase, config: Config) {
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

  public postURrlFile = async (userId: number, sourceUrl: string) => {
    dataLogger.trace('FileWorker.uploadFile()');
    try {
      switch (true) {
        case sourceUrl.indexOf('youtube') > -1:
          sourceUrl = 'https://youtu.be/' + parseURLYouTube(sourceUrl);
          await this.db.postURrlFile(
            this.config,
            userId,
            sourceUrl,
            this.config.rabbitMQDownloadingYouTubeQueue
          );
          break;
        case sourceUrl.indexOf('youtu') > -1:
          await this.db.postURrlFile(
            this.config,
            userId,
            sourceUrl,
            this.config.rabbitMQDownloadingYouTubeQueue
          );
          break;
        default:
          break;
      }
      return new Response(Response.Code.Ok, `Start downloading ${sourceUrl}`);
    } catch (err) {
      dataLogger.warn(`FileWorker.uploadFile: ${err}`);
      const fileId = await this.db.getFileBySourceUrl(sourceUrl);
      if (fileId) {
        const mapFile = await this.db.mapUserFile(userId, fileId);
        if (!mapFile) {
          return new Response(Response.Code.Ok, 'File already exists');
        } else {
          return new Response(
            Response.Code.Ok,
            'The file was successfully added'
          );
        }
      } else {
        return new Response(
          Response.Code.InternalServerError,
          'Server error',
          1
        );
      }
    }
  };
}
