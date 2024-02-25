import { randomUUID } from 'crypto';

import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { FileSource } from '@src/entities/source';
import { Status } from '@src/entities/status';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { PluginManager } from '@src/pluginManager';
import { dataLogger } from '@src/utils/server/logger';

import { ErrorManager } from './errorManager';

export class FileWorker {
  private db: iFileDatabase;
  private pluginManager: PluginManager;
  constructor(db: iFileDatabase, pluginManager: PluginManager) {
    this.db = db;
    this.pluginManager = pluginManager;
    dataLogger.trace('FileWorker initialized');
  }

  public downloadFile = async (sourceUrl: string, user: User) => {
    dataLogger.trace('FileWorker.downloadFile()');
    const filePlugin = this.pluginManager.getPlugin(
      PluginManager.PluginType.FilePlugin
    );
    const urlDescription = await filePlugin.getSourceDescription(sourceUrl);
    const normalizedUrl = await filePlugin.getCorrectUrl(sourceUrl);
    const file = await this.db.getFileByUrl(normalizedUrl);
    if (!file) {
      const newFile: File | null = new File(
        0,
        randomUUID(),
        new FileSource(0, normalizedUrl, urlDescription, ''),
        Status.Created
      );
      try {
        const fileRecord = await this.db.insertFileTransaction(newFile, user);
        return this.requestFileProcessing(fileRecord);
      } catch (err) {
        return ErrorManager.responseError(
          `FileWorker.manageFileDownload: ${err}`,
          'Server error',
          Response.Code.InternalServerError
        );
      }
    }
    return new Response(Response.Code.Ok, 'File already exists', 0);
  };

  public requestFileProcessing = async (file: File) => {
    dataLogger.trace('FileWorker.requestFileProcessing()');
    try {
      const filePlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.FilePlugin
      );
      const tagPlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.TagPlugin
      );
      await filePlugin.downloadFile(file);
      await tagPlugin.tagFile(file);
      return new Response(Response.Code.Ok, `File downloaded`);
    } catch (err) {
      return ErrorManager.responseError(
        `FileWorker.requestFileProcessing: ${err}`,
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
    // FIXME: This method should return an image
    dataLogger.trace('FileWorker.getPictureBySourceId()');
    try {
      const source = await this.db.getPictureBySourceId(sourceId);
      if (!source) {
        return new Response(Response.Code.Ok, 'No picture', 0);
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
