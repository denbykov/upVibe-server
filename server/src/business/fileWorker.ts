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

import { ErrorManager } from './errorManager';

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
      const responseFileRecord = await this.db.insertTransactionFile(
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
      return ErrorManager.responseError(
        `FileWorker.downloadFileBySource: ${err}`,
        'Server error',
        Response.Code.InternalServerError
      );
    }
  };

  public getFilesByUser = async (user: User) => {
    dataLogger.trace('FileWorker.getFilesByUser()');
    try {
      const userFiles = await this.db.getFilesByUser(user);
      if (!userFiles) {
        return new Response(Response.Code.Ok, 'No files', 0);
      }
      return new Response(Response.Code.Ok, userFiles, 0);
    } catch (err) {
      return ErrorManager.responseError(
        `FileWorker.getFilesByUser: ${err}`,
        'Server error',
        Response.Code.InternalServerError
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
      return new Response(Response.Code.Ok, file, 0);
    } catch (err) {
      return ErrorManager.responseError(
        `FileWorker.getFileById: ${err}`,
        'Server error',
        Response.Code.InternalServerError
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
      return new Response(Response.Code.Ok, sources, 0);
    } catch (err) {
      return ErrorManager.responseError(
        `FileWorker.getFileSources: ${err}`,
        'Server error',
        Response.Code.InternalServerError
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
      return new Response(Response.Code.Ok, source, 0);
    } catch (err) {
      return ErrorManager.responseError(
        `FileWorker.getPictureBySourceId: ${err}`,
        'Server error',
        Response.Code.InternalServerError
      );
    }
  };
}
