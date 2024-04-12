import { randomUUID } from 'crypto';

import { ProcessingError } from '@src/business/processingError';
import { FileDTO } from '@src/dto/fileDTO';
import { Status } from '@src/dto/statusDTO';
import { TagDTO } from '@src/dto/tagDTO';
import { TagMappingDTO } from '@src/dto/tagMappingDTO';
import { File } from '@src/entities/file';
import { GetFileResponse } from '@src/entities/getFileResponse';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';

export class FileWorker {
  private db: iFileDatabase;
  private sourceDb: iSourceDatabase;
  private tagDb: iTagDatabase;
  private filePlugin: iFilePlugin;
  private tagPlugin: iTagPlugin;

  constructor(
    db: iFileDatabase,
    sourceDb: iSourceDatabase,
    tagDb: iTagDatabase,
    filePlugin: iFilePlugin,
    tagPlugin: iTagPlugin
  ) {
    this.db = db;
    this.sourceDb = sourceDb;
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
        new FileDTO('0', randomUUID(), sourceId, Status.Created, normalizedUrl)
      );
      await this.tagDb.insertTag(
        TagDTO.allFromOneSource('0', file.id, true, sourceId, Status.Created)
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
    userId: string
  ): Promise<void> => {
    const source = await this.sourceDb.getSource(file.source);
    await this.filePlugin.downloadFile(file, source!.description);
    await this.tagPlugin.tagFile(file, userId, source!.description);
  };

  public getTaggedFilesByUser = async (user: User): Promise<Array<File>> => {
    const userFiles = await this.db.getTaggedFilesByUser(user);

    const files: Array<File> = userFiles.map((file) => {
      return file.toEntity();
    });

    return files;
  };

  public getTaggedFile = async (
    id: string,
    user: User,
    expand: string[]
  ): Promise<GetFileResponse> => {
    let mapping = null;

    const file = await this.db.getTaggedFile(id, user.id);
    if (!file) {
      throw new ProcessingError('File not found');
    }

    for (const variation of expand) {
      if (variation === 'mapping') {
        const mappingDto = await this.tagDb.getTagMapping(user.id, file.id);
        if (!mappingDto) {
          throw new ProcessingError('Mapping not found');
        }
        mapping = mappingDto.toEntity();
      } else {
        throw new ProcessingError(`${variation} is not a valid epxand option`);
      }
    }

    return new GetFileResponse(file.toEntity(), mapping);
  };
}
