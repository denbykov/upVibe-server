import { UUID, randomUUID } from 'crypto';

import { Config } from '@src/entities/config';
import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { Status } from '@src/entities/status';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { dataLogger } from '@src/utils/server/logger';
import { parseYoutubeURL } from '@src/utils/server/parseYoutubeURL';

export class FileWorker {
  private db: iFileDatabase;
  private config: Config;
  private plugin: iFilePlugin;
  constructor(db: iFileDatabase, config: Config, plugin: iFilePlugin) {
    this.db = db;
    this.config = config;
    this.plugin = plugin;
    dataLogger.trace('FileWorker initialized');
  }

  public manageFileDownload = async (sourceUrl: string, user: User) => {
    dataLogger.trace('FileWorker.manageFileDownload()');
    const file = await this.db.getFileByUrl(sourceUrl);
    if (!file) {
      const source = parseYoutubeURL(sourceUrl);
      if (!source) {
        return new Response(Response.Code.BadRequest, 'Invalid source URL', -1);
      }
      const newFile = new File(
        0,
        randomUUID(),
        {
          id: 0,
          url: sourceUrl,
          description: source.description,
          logoPath: source.logoPath,
        },
        Status.Created
      );
      const insertedFile = await this.db.insertFileRecord(newFile);
      if (!insertedFile) {
        return new Response(
          Response.Code.InternalServerError,
          'Server error',
          -1
        );
      }
      return await this.downloadFileBySource(insertedFile);
    }
  };

  public downloadFileBySource = async (file: File) => {
    dataLogger.trace('FileWorker.downloadFileBySource()');
    try {
      await this.plugin.downloadFile(file.id, file.source.url, file.path);
      return new Response(Response.Code.Ok, `File downloaded`);
    } catch (err) {
      dataLogger.warn(`FileWorker.downloadFileBySource: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        'Server error',
        -1
      );
    }
  };
}
