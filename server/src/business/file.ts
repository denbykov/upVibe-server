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
    try {
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
        const fileRecord = await this.db.insertFileTransaction(
          temporaryFile,
          user
        );
        return this.requestFileProcessing(
          fileRecord,
          user.id,
          sourceDescription
        );
      }
      return new Response(Response.Code.Ok, { ...file });
    } catch (err) {
      dataLogger.error(`FileWorker.downloadFile: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        { message: 'Server error' },
        -1
      );
    }
  };

  public requestFileProcessing = async (
    file: FileDTO,
    userId: number,
    routingKey: string
  ) => {
    dataLogger.trace('FileWorker.requestFileProcessing()');
    try {
      const filePlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.FilePlugin
      );
      const tagPlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.TagPlugin
      );
      await filePlugin.downloadFile(file, routingKey);
      await tagPlugin.tagFile(file, userId, routingKey);
      const taggedFile = await this.db.getFileByUrl(file.sourceUrl);
      return new Response(Response.Code.Ok, { taggedFile });
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
      return new Response(Response.Code.Ok, { logoPath: source.logoPath }, 0);
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
