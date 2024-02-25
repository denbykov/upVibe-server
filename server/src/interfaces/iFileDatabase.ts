import pg from 'pg';

import { FileSources } from '@src/dto/file';
import { MappingFiles } from '@src/dto/mappingFiles';
import { File } from '@src/entities/file';
import { FileSource, TagSource } from '@src/entities/source';
import { User } from '@src/entities/user';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<File | null>;
  public abstract getFilesByUser: (user: User) => Promise<MappingFiles>;
  public abstract getFileSources: () => Promise<FileSources | null>;
  public abstract getPictureBySourceId: (
    sourceId: string
  ) => Promise<FileSource | null>;
  public abstract getFileSource: (
    description: string,
    client: pg.PoolClient
  ) => Promise<FileSource>;
  public abstract getTagSources: (
    description: string,
    client: pg.PoolClient
  ) => Promise<TagSource>;
  public abstract insertFile: (
    file: File,
    sourceId: number,
    client: pg.PoolClient
  ) => Promise<File>;
  public abstract insertFileTagMapping: (
    fileId: number,
    userId: number,
    sourceId: number,
    client: pg.PoolClient
  ) => Promise<void>;
  public abstract insertUserFile: (
    userId: number,
    fileId: number,
    client: pg.PoolClient
  ) => Promise<void>;
  public abstract insertFileTransaction: (
    file: File,
    user: User
  ) => Promise<File>;
}
