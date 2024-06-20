import { ProcessingError } from '@src/business/processingError';
import { Status } from '@src/dtos/statusDTO';
import { File } from '@src/entities/file';
import { FileData } from '@src/entities/fileData';
import { GetFileResponse } from '@src/entities/getFileResponse';
import { Source } from '@src/entities/source';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iFileTagger } from '@src/interfaces/iFileTagger';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { TagMappingMapper } from '@src/mappers/tagMappingMapper';
import { TaggedFileMapper } from '@src/mappers/taggedFileMapper';

export class FileWorker {
  private db: iFileDatabase;
  private tagDb: iTagDatabase;
  private filePlugin: iFilePlugin;
  private fileTagger: iFileTagger;

  constructor(
    db: iFileDatabase,
    tagDb: iTagDatabase,
    filePlugin: iFilePlugin,
    fileTagger: iFileTagger
  ) {
    this.db = db;
    this.tagDb = tagDb;
    this.filePlugin = filePlugin;
    this.fileTagger = fileTagger;
  }

  public downloadFile = async (
    sourceUrl: string,
    user: User
  ): Promise<File> => {
    const normalizedUrl = await this.filePlugin.normalizeUrl(sourceUrl);

    const file = await this.db.getFileByUrl(normalizedUrl);
    if (!file) {
      await this.filePlugin.requestFileProcessing(sourceUrl, user.id, '1');
      return new File(
        '',
        new Source('', ''),
        Status.Created,
        normalizedUrl,
        false,
        null
      );
    }
    const taggedFile = await this.db.getTaggedFileByUrl(file.sourceUrl, user);
    return new TaggedFileMapper().toEntity(taggedFile!);
  };

  public getTaggedFilesByUser = async (
    user: User,
    deviceId: string,
    statuses: Array<string> | null,
    synchronized: boolean | null
  ): Promise<Array<File>> => {
    const userFiles = await this.db.getTaggedFilesByUser(
      user,
      deviceId,
      statuses,
      synchronized
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
        const mappingDTO = await this.tagDb.getTagMapping(user.id, file.id);
        if (!mappingDTO) {
          throw new ProcessingError('Mapping not found');
        }
        mapping = new TagMappingMapper().toEntity(mappingDTO);
      } else {
        throw new ProcessingError(`${variation} is not a valid epxand option`);
      }
    }

    return new GetFileResponse(new TaggedFileMapper().toEntity(file), mapping);
  };

  public confirmFile = async (
    id: string,
    user: User,
    deviceId: string
  ): Promise<void> => {
    await this.db.confirmFile(id, user.id, deviceId);
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
}
