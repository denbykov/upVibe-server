import { randomUUID } from 'crypto';

import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { Status } from '@src/entities/status';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { getCorrectUrl } from '@src/utils/server/getCorrectUrl';
import { getAuthoritySource } from '@src/utils/server/getReferenceSource';
import { dataLogger } from '@src/utils/server/logger';

export class FileWorker {
  private db: iFileDatabase;
  private plugin: iFilePlugin;
  constructor(db: iFileDatabase, plugin: iFilePlugin) {
    this.db = db;
    this.plugin = plugin;
    dataLogger.trace('FileWorker initialized');
  }

  public manageFileDownload = async (sourceUrl: string, user: User) => {
    dataLogger.trace('FileWorker.manageFileDownload()');
    const file = await this.db.getFileByUrl(sourceUrl);
    if (!file) {
      const description = getAuthoritySource(sourceUrl) || '';
      const newFile: File | null = new File(
        0,
        randomUUID(),
        {
          id: 0,
          url: getCorrectUrl(sourceUrl, description),
          description: description,
          logoPath: '',
        },
        Status.Created
      );
      const responseFileRecord = await this.db.insertTransactionFileRecord(
        newFile,
        user,
        this.downloadFileBySource
      );

      return responseFileRecord;
    }
    return new Response(Response.Code.Ok, 'File already exists');
  };

  public downloadFileBySource = async (file: File) => {
    dataLogger.trace('FileWorker.downloadFileBySource()');
    try {
      await this.plugin.downloadFile(file);
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
