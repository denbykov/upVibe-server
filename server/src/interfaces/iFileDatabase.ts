import pg from 'pg';

import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { FileSource, TagSource } from '@src/entities/source';
import { Tag } from '@src/entities/tag';
import { User } from '@src/entities/user';

export abstract class iFileDatabase {
  public abstract getFileByUrl: (url: string) => Promise<File | null>;
  public abstract getFilesByUser: (
    user: User
  ) => Promise<Array<
    Record<
      string,
      | number
      | string
      | Record<string, number | string>
      | Array<Record<string, number | string>>
    >
  > | null>;
  public abstract getFileById: (
    fileId: string
  ) => Promise<Record<
    string,
    | string
    | number
    | Record<string, string | number>
    | Array<Record<string, string | number>>
  > | null>;
  public abstract getFileSources: () => Promise<FileSource[] | null>;
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
  public abstract insertTransactionFile: (
    file: File,
    user: User,
    downloadFileBySource: (file: File) => Promise<Response>
  ) => Promise<Response>;
  public abstract insertFileTag: (
    tag: Tag,
    client: pg.PoolClient
  ) => Promise<void>;
}
