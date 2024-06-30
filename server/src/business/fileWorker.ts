import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';

import { ProcessingError } from '@src/business/processingError';
import { FileDTO } from '@src/dtos/fileDTO';
import { Status } from '@src/dtos/statusDTO';
import { TagDTO } from '@src/dtos/tagDTO';
import { TagMappingDTO } from '@src/dtos/tagMappingDTO';
import { File } from '@src/entities/file';
import { FileData } from '@src/entities/fileData';
import { GetFileResponse } from '@src/entities/getFileResponse';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iFileTagger } from '@src/interfaces/iFileTagger';
import { iPlaylistDatabase } from '@src/interfaces/iPlaylistDatabase';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';
import { TagMappingMapper } from '@src/mappers/tagMappingMapper';
import { TaggedFileMapper } from '@src/mappers/taggedFileMapper';

export class FileWorker {
  private db: iFileDatabase;
  private sourceDb: iSourceDatabase;
  private tagDb: iTagDatabase;
  private playlistDb: iPlaylistDatabase;
  private filePlugin: iFilePlugin;
  private tagPlugin: iTagPlugin;
  private fileTagger: iFileTagger;

  constructor(
    db: iFileDatabase,
    sourceDb: iSourceDatabase,
    tagDb: iTagDatabase,
    playlistDb: iPlaylistDatabase,
    filePlugin: iFilePlugin,
    tagPlugin: iTagPlugin,
    fileTagger: iFileTagger
  ) {
    this.db = db;
    this.sourceDb = sourceDb;
    this.tagDb = tagDb;
    this.playlistDb = playlistDb;
    this.filePlugin = filePlugin;
    this.tagPlugin = tagPlugin;
    this.fileTagger = fileTagger;
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

    const userPlaylistId = await this.playlistDb.getDefaultUserPlaylistId(
      user.id
    );

    const playlistFile = await this.playlistDb.getUserPlaylistFile(
      file!.id,
      user.id,
      userPlaylistId
    );

    if (playlistFile) {
      throw new ProcessingError('File already exists');
    }

    await this.playlistDb.insertUserPaylistFile(userPlaylistId, file.id);

    const userFile = await this.db.getUserFile(user.id, file!.id);

    let userFileId;
    if (!userFile) {
      userFileId = await this.db.insertUserFile(user.id, file!.id);
    } else {
      userFileId = userFile.id;
    }

    await this.tagDb.insertTagMapping(
      TagMappingDTO.allFromOneSource(user.id, file.id, sourceId)
    );
    await this.db.insertSynchronizationRecordsByUser(user.id, userFileId);
    const taggedFile = await this.db.getTaggedFileByUrl(file.sourceUrl, user);
    return new TaggedFileMapper().toEntity(taggedFile![0]);
  };

  public requestFileProcessing = async (
    file: FileDTO,
    userId: string
  ): Promise<void> => {
    const source = await this.sourceDb.getSource(file.source);
    await this.filePlugin.downloadFile(file, source!.description);
    await this.tagPlugin.tagFile(file, userId, source!.description);
  };

  public getTaggedFilesByUser = async (
    user: User,
    deviceId: string,
    statuses: Array<string> | null,
    synchronized: boolean | null,
    playlists: Array<string> | null
  ): Promise<Array<File>> => {
    const userFiles = await this.db.getTaggedFilesByUser(
      user,
      deviceId,
      statuses,
      synchronized,
      playlists
    );

    const files: Array<File> = userFiles.map((file) => {
      return new TaggedFileMapper().toEntity(file);
    });

    return files;
  };

  public getTaggedFile = async (
    id: string,
    deviceId: string,
    user: User,
    expand: string[]
  ): Promise<GetFileResponse> => {
    let mapping = null;

    const file = await this.db.getTaggedFile(id, deviceId, user.id);
    if (!file) {
      throw new ProcessingError('File not found');
    }

    for (const variation of expand) {
      if (variation === 'mapping') {
        const mappingDTO = await this.tagDb.getTagMapping(user.id, file[0].id);
        if (!mappingDTO) {
          throw new ProcessingError('Mapping not found');
        }
        mapping = new TagMappingMapper().toEntity(mappingDTO);
      } else {
        throw new ProcessingError(`${variation} is not a valid epxand option`);
      }
    }

    return new GetFileResponse(
      new TaggedFileMapper().toEntity(file[0]),
      mapping
    );
  };

  public confirmFile = async (
    fileId: string,
    user: User,
    deviceId: string
  ): Promise<void> => {
    const existFile = await this.db.getUserFile(user.id, fileId);
    const existSync = await this.db.getSyncrhonizationRecordsByDevice(
      deviceId,
      existFile!.id
    );
    const existPlaylistFile = await this.playlistDb.getUserPlaylistFile(
      fileId,
      user.id,
      existFile!.id
    );

    if (existPlaylistFile) {
      await this.db.updateSynchronizationRecords(
        new Date().toISOString(),
        existFile!.id
      );
      return;
    }

    await this.db.deleteSyncrhonizationRecordsByDevice(
      existSync.deviceId,
      existSync.userFileId
    );

    const existSyncByUserFile =
      await this.db.getSyncrhonizationRecordsByUserFile(existFile!.id);

    if (existSyncByUserFile.isSynchronized) {
      return;
    }

    await this.db.deleteUserFile(user.id, existFile!.id);
    const userFiles = await this.db.getUserFilesByFileId(existFile!.id);
    if (userFiles.length) {
      return;
    }
    userFiles.forEach(async (userFile) => {
      await this.db.deleteUserFile(userFile.userId, userFile.fileId);
      const file = await this.db.getFile(userFile.fileId);
      await fs.unlink(file!.path);
      await this.db.deleteFileById(userFile.fileId);
    });
  };

  public tagFile = async (
    fileId: string,
    userId: string
  ): Promise<FileData> => {
    const file = await this.db.getFile(fileId);

    if (file === null || file!.status !== Status.Completed) {
      throw new ProcessingError('File not found or not processed');
    }

    const tag = await this.tagDb.getMappedTag(fileId, userId);

    const data = await this.fileTagger.tagFile(file!.path, tag);

    return new FileData(`${file!.path}.mp3`, data);
  };

  public deleteFile = async (
    fileId: string,
    userId: string,
    playlistIds: Array<string>
  ): Promise<void> => {
    const existFile = await this.db.getUserFile(userId, fileId);
    if (!existFile) {
      throw new ProcessingError('File not found');
    }
    await this.playlistDb.deleteUserPlaylistsFile(fileId, userId, playlistIds);
    await this.db.updateSynchronizationRecords(
      new Date().toISOString(),
      existFile.id
    );
    return;
  };
}
