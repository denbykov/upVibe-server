import pg from 'pg';

import { FileDTO } from '@src/dto/file';
import { File } from '@src/entities/file';
import { FileSources } from '@src/entities/source';
import { FileSource, TagSource } from '@src/entities/source';
import { TaggedFiles } from '@src/entities/taggedFile';
import { User } from '@src/entities/user';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<File | null>;
  public abstract getFilesByUser: (user: User) => Promise<TaggedFiles | null>;
  public abstract getFileSources: () => Promise<FileSources | null>;
  public abstract getPictureBySourceId: (
    sourceId: string
  ) => Promise<FileSource | null>;
  public abstract getTagSources: (
    description: string,
    client: pg.PoolClient
  ) => Promise<TagSource>;
  public abstract insertFile: (
    file: FileDTO,
    client: pg.PoolClient
  ) => Promise<FileDTO>;
  public abstract mapUserFile: (
    userId: number,
    fileId: number,
    client: pg.PoolClient
  ) => Promise<void>;
  public abstract insertFileTransaction: (
    file: FileDTO,
    user: User
  ) => Promise<FileDTO>;
  public abstract getSourceIdByDescription: (
    description: string
  ) => Promise<number>;
}
