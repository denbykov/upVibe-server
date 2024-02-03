import { randomUUID } from 'crypto';

import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { FileSource } from '@src/entities/source';
import { Status } from '@src/entities/status';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iPluginManager } from '@src/interfaces/iPluginManager';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';
import { PluginManager } from '@src/pluginManager';
import { getCorrectUrl } from '@src/utils/server/getCorrectUrl';
import { getAuthoritySource } from '@src/utils/server/getReferenceSource';
import { dataLogger } from '@src/utils/server/logger';

export class FileWorker {
  private db: iFileDatabase;
  private filePlugin: iFilePlugin;
  private tagPlugin: iTagPlugin;
  constructor(db: iFileDatabase, pluginManager: iPluginManager) {
    this.db = db;
    this.filePlugin = pluginManager.getPlugin(
      PluginManager.PluginType.FilePlugin
    ) as iFilePlugin;
    this.tagPlugin = pluginManager.getPlugin(
      PluginManager.PluginType.TagPlugin
    ) as iTagPlugin;
    dataLogger.trace('FileWorker initialized');
  }

  public manageFileDownload = async (sourceUrl: string, user: User) => {
    dataLogger.trace('FileWorker.manageFileDownload()');
    const description = getAuthoritySource(sourceUrl) || '';
    const sourceUrlCorrected = getCorrectUrl(sourceUrl, description);
    const file = await this.db.getFileByUrl(sourceUrlCorrected);
    if (!file) {
      const newFile: File | null = new File(
        0,
        randomUUID(),
        new FileSource(0, sourceUrlCorrected, description, ''),
        Status.Created
      );
      const responseFileRecord = await this.db.insertTransactionFileRecord(
        newFile,
        user,
        this.downloadFileBySource
      );

      return responseFileRecord;
    }
    return new Response(Response.Code.Ok, 'File already exists', 0);
  };

  public downloadFileBySource = async (file: File) => {
    dataLogger.trace('FileWorker.downloadFileBySource()');
    try {
      await this.filePlugin.downloadFile(file);
      await this.tagPlugin.tagFile(file);
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

  public getFilesByUser = async (user: User) => {
    dataLogger.trace('FileWorker.getFilesByUser()');
    try {
      const unionFileTag = await this.db.getFilesByUser(user);
      if (!unionFileTag) {
        return new Response(Response.Code.Ok, 'No files', 0);
      }
      const convertedArrayToJSONObjects = unionFileTag.map((file) => {
        return file.toJSON();
      });
      return new Response(Response.Code.Ok, convertedArrayToJSONObjects, 0);
    } catch (err) {
      dataLogger.warn(`FileWorker.getFilesByUser: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        'Server error',
        -1
      );
    }
  };

  public getFileById = async (fileId: string) => {
    dataLogger.trace('FileWorker.getFileById()');
    try {
      const file = await this.db.getFileById(fileId);
      if (!file) {
        return new Response(Response.Code.NotFound, 'File not found', -1);
      }
      return new Response(Response.Code.Ok, file.toJSON(), 0);
    } catch (err) {
      dataLogger.warn(`FileWorker.getFileById: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        'Server error',
        -1
      );
    }
  };

  public getFileSources = async () => {
    dataLogger.trace('FileWorker.getSources()');
    try {
      const sources = await this.db.getFileSources();
      if (!sources) {
        return new Response(Response.Code.Ok, 'No sources', 0);
      }
      const convertedArrayToJSONObjects = sources.map((source) => {
        return source.toJSON();
      });
      return new Response(Response.Code.Ok, convertedArrayToJSONObjects, 0);
    } catch (err) {
      dataLogger.warn(`FileWorker.getSources: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        'Server error',
        -1
      );
    }
  };

  public getPictureBySourceId = async (sourceId: string) => {
    dataLogger.trace('FileWorker.getPictureBySourceId()');
    try {
      const source = await this.db.getPictureBySourceId(sourceId);
      if (!source) {
        return new Response(Response.Code.NotFound, 'Source not found', -1);
      }
      return new Response(Response.Code.Ok, source.toJSON(), 0);
    } catch (err) {
      dataLogger.warn(`FileWorker.getPictureBySourceId: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        'Server error',
        -1
      );
    }
  };
}
