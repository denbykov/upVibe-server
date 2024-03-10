import { randomUUID } from 'crypto';

import { FileDTO } from '@src/dto/file';
import { Status } from '@src/dto/status';
import { TagMappingDTO } from '@src/dto/tagMapping';
import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { FileSource } from '@src/entities/source';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { PluginManager } from '@src/pluginManager';
import { businessLogger } from '@src/utils/server/logger';

export class FileWorker {
  private db: iFileDatabase;
  private tagDb: iTagDatabase;
  // FixMe: do not pass plugin manager to worker!
  private pluginManager: PluginManager;

  constructor(
    db: iFileDatabase,
    tagDb: iTagDatabase,
    pluginManager: PluginManager
  ) {
    this.db = db;
    this.tagDb = tagDb;
    this.pluginManager = pluginManager;
  }

  public downloadFile = async (
    sourceUrl: string,
    user: User
  ): Promise<File> => {
    const filePlugin = this.pluginManager.getPlugin(
      PluginManager.PluginType.FilePlugin
    );

    // FixMe: replace with get source id directly
    // const sourceDescription = await filePlugin.getSourceDescription(sourceUrl);
    const sourceId = 1;
    const normalizedUrl = await filePlugin.getCorrectUrl(sourceUrl);

    let file = await this.db.getFileByUrl(normalizedUrl);

    if (!file) {
      file = await this.db.insertFile(
        new FileDTO(0, randomUUID(), sourceId, Status.Created, normalizedUrl)
      );
      await this.requestFileProcessing(file!, user.id);
    }

    if (await this.db.doesUserFileExist(user.id, file!.id)) {
      throw new Error('File already exists');
    }

    await this.db.insertUserFile(user.id, file!.id);
    await this.tagDb.insertTagMapping(
      TagMappingDTO.allFromOneSource(user.id, file!.id, sourceId)
    );
    const taggedFile = await this.db.getTaggedFileByUrl(file.sourceUrl, user);
    return File.fromDTO(taggedFile!);
  };

  public requestFileProcessing = async (
    file: FileDTO,
    userId: number
  ): Promise<void> => {
    try {
      const filePlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.FilePlugin
      );
      const tagPlugin = this.pluginManager.getPlugin(
        PluginManager.PluginType.TagPlugin
      );
      const source = await this.db.getFileSource(file.sourceId);
      await filePlugin.downloadFile(file, source.description);
      await tagPlugin.tagFile(file, userId, source.description);
    } catch (err) {
      businessLogger.error(`FileWorker.requestFileProcessing: ${err}`);
      throw err;
    }
  };

  public getTaggedFilesByUser = async (user: User): Promise<Array<File>> => {
    try {
      const userFiles = await this.db.getTaggedFilesByUser(user);

      const files: Array<File> = userFiles.map((file) => {
        return File.fromDTO(file);
      });

      return files;
    } catch (err) {
      throw new Error('Server error');
    }
  };

  public getFileSources = async (): Promise<Array<FileSource>> => {
    try {
      const sources = await this.db.getFileSources();
      return sources.map((source) => {
        return FileSource.fromDTO(source);
      });
    } catch (err) {
      throw new Error('Server error');
    }
  };

  public getPictureBySource = async (sourceId: number) => {
    try {
      const source = await this.db.getFileSource(sourceId);
      if (!source) {
        return new Response(Response.Code.Ok, { message: 'No picture' }, 0);
      }
      return new Response(Response.Code.Ok, { logoPath: source.logoPath }, 0);
    } catch (err) {
      return new Response(
        Response.Code.InternalServerError,
        { message: 'Server error' },
        -1
      );
    }
  };
}
