import { Config } from '@src/entities/config';
import pg from 'pg';

class BaseController {
  protected apiURI: string;
  protected apiURIAuth: string;
  protected config: Config;
  protected databasePool: pg.Pool;
  constructor(config: Config, databasePool: pg.Pool) {
    this.apiURI = `/${config.apiURI}/${config.apiVersion}`;
    this.apiURIAuth = `/${config.apiURI}/${config.apiVersion}/auth`;
    this.config = config;
    this.databasePool = databasePool;
  }
}

export { BaseController };
