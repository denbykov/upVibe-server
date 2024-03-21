import { randomUUID } from 'crypto';

import { ProcessingError } from '@src/business/processingError';
import { FileDTO } from '@src/dto/fileDTO';
import { Status } from '@src/dto/statusDTO';
import { TagMappingDTO } from '@src/dto/tagMappingDTO';
import { File } from '@src/entities/file';
import { FileSource } from '@src/entities/source';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';

export class FileWorker {
  private db: iFileDatabase;
  private tagDb: iTagDatabase;
  private filePlugin: iFilePlugin;
  private tagPlugin: iTagPlugin;

  constructor(
    db: iFileDatabase,
    tagDb: iTagDatabase,
    filePlugin: iFilePlugin,
    tagPlugin: iTagPlugin
  ) {
    this.db = db;
    this.tagDb = tagDb;
    this.filePlugin = filePlugin;
    this.tagPlugin = tagPlugin;
  }

  public downloadFile = async (
    sourceUrl: string,
    user: User
  ): Promise<File> => {
    const sourceId = await this.filePlugin.getSource(sourceUrl);
    const normalizedUrl = await this.filePlugin.normalizeUrl(sourceUrl);

    let file = await this.db.getFileByUrl(normalizedUrl);

    if (!file) {
      file = await this.db.insertFile(
        new FileDTO(0, randomUUID(), sourceId, Status.Created, normalizedUrl)
      );
      await this.requestFileProcessing(file!, user.id);
    }

    if (await this.db.doesUserFileExist(user.id, file!.id)) {
      throw new ProcessingError('File already exists');
    }

    await this.db.insertUserFile(user.id, file!.id);
    await this.tagDb.insertTagMapping(
      TagMappingDTO.allFromOneSource(user.id, file!.id, sourceId)
    );
    const taggedFile = await this.db.getTaggedFileByUrl(file.sourceUrl, user);
    return taggedFile!.toEntity();
  };

  public requestFileProcessing = async (
    file: FileDTO,
    userId: number
  ): Promise<void> => {
    const source = await this.db.getFileSource(file.sourceId);
    await this.filePlugin.downloadFile(file, source.description);
    await this.tagPlugin.tagFile(file, userId, source.description);
  };

  public getTaggedFilesByUser = async (user: User): Promise<Array<File>> => {
    const userFiles = await this.db.getTaggedFilesByUser(user);

    const files: Array<File> = userFiles.map((file) => {
      return file.toEntity();
    });

    return files;
  };

  public getSources = async (): Promise<Array<FileSource>> => {
    const sources = await this.db.getFileSources();
    return sources.map((source) => {
      return source.toEntity();
    });
  };

  public getSourceLogo = async (sourceId: number): Promise<string> => {
    const source = await this.db.getFileSource(sourceId);
    if (!source) {
      throw new ProcessingError('Source not found');
    }

    if (source.logoPath === null) {
      throw new ProcessingError('No picture for source');
    }

    return source.logoPath;
  };

  public getTaggedFile = async (id: number, user: User): Promise<File> => {
    const file = await this.db.getTaggedFile(id, user.id);
    if (!file) {
      throw new ProcessingError('File not found');
    }

    return file.toEntity();
  };
}
