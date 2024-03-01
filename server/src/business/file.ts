import { randomUUID } from 'crypto';

import { FileDTO } from '@src/dto/file';
import { FileSourceDTO } from '@src/dto/source';
import { Status } from '@src/dto/status';
import { Response } from '@src/entities/response';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { PluginManager } from '@src/pluginManager';
import { dataLogger } from '@src/utils/server/logger';

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
    const sourceDescription = await filePlugin.getSourceDescription(sourceUrl);
    const normalizedUrl = await filePlugin.getCorrectUrl(sourceUrl);
    const file = await this.db.getFileByUrl(normalizedUrl);
    if (!file) {
      const sourceId = await this.db.getSourceIdByDescription(
        sourceDescription
      );
      const temporaryFile: FileDTO = new FileDTO(
        0,
        randomUUID(),
        FileSourceDTO.fromJSON({
          file_sources_id: sourceId,
        }),
        Status.Created,
        normalizedUrl
      );
      try {
        const fileRecord = await this.db.insertFileTransaction(
          temporaryFile,
          user
        );
        return this.requestFileProcessing(fileRecord, sourceDescription);
      } catch (err) {
        dataLogger.error(`FileWorker.downloadFile: ${err}`);
        return new Response(
          Response.Code.InternalServerError,
          { message: 'Server error' },
          -1
        );
      }
    }
    return new Response(
      Response.Code.Ok,
      { message: 'File already exists' },
      0
    );
  };

  public requestFileProcessing = async (file: FileDTO, routingKey: string) => {
    dataLogger.trace('FileWorker.requestFileProcessing()');
    try {
      const filePlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.FilePlugin
      );
      const tagPlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.TagPlugin
      );
      await filePlugin.downloadFile(file, routingKey);
      await tagPlugin.tagFile(file, routingKey);
      return new Response(Response.Code.Ok, { message: 'File downloaded' });
    } catch (err) {
      dataLogger.error(`FileWorker.requestFileProcessing: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        { message: 'Server error' },
        -1
      );
    }
  };

  public getFilesByUser = async (user: User) => {
    dataLogger.trace('FileWorker.getFilesByUser()');
    try {
      const userFiles = await this.db.getFilesByUser(user);
      return new Response(Response.Code.Ok, userFiles!, 0);
    } catch (err) {
      dataLogger.error(`FileWorker.getFilesByUser: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        { message: 'Server error' },
        -1
      );
    }
  };

  public getFileSources = async () => {
    dataLogger.trace('FileWorker.getSources()');
    try {
      const sources = await this.db.getFileSources();
      if (!sources) {
        return new Response(Response.Code.Ok, { message: 'No sources' }, 0);
      }
      return new Response(Response.Code.Ok, sources, 0);
    } catch (err) {
      dataLogger.error(`FileWorker.getFileSources: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        { message: 'Server error' },
        -1
      );
    }
  };

  public getPictureBySourceId = async (sourceId: string) => {
    dataLogger.trace('FileWorker.getPictureBySourceId()');
    try {
      const source = await this.db.getPictureBySourceId(sourceId);
      if (!source) {
        return new Response(Response.Code.Ok, { message: 'No picture' }, 0);
      }
      return new Response(Response.Code.Ok, source, 0);
    } catch (err) {
      dataLogger.error(`FileWorker.getPictureBySourceId: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        { message: 'Server error' },
        -1
      );
    }
  };
}
