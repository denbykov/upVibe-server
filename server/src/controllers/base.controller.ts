import pg from 'pg';

import { Config } from '@src/entities/config';

class BaseController {
  public apiURI: string;
  public apiURIAuth: string;
  public apiURIFiles: string;
  public apiURIFile: string;
  public apiURITags: string;
  public config: Config;
  public databasePool: pg.Pool;
  constructor(config: Config, databasePool: pg.Pool) {
    this.apiURI = `/${config.apiURI}/${config.apiVersion}`;
    this.apiURIAuth = `/${config.apiURI}/${config.apiVersion}/auth`;
    this.apiURIFiles = `/${config.apiURI}/${config.apiVersion}/library/files`;
    this.apiURIFile = `/${config.apiURI}/${config.apiVersion}/library/file`;
    this.apiURITags = `/${config.apiURI}/${config.apiVersion}/library/tags`;
    this.config = config;
    this.databasePool = databasePool;
  }
}

export { BaseController };
