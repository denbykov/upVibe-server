import { Config } from '@entities/config';
import { ConnectionValidator } from '@utils/connectionValidator';
import { appLogger } from '@utils/logger';
import { parseJSONConfig } from '@utils/parseJSONConfig';
import dotenv from 'dotenv';
import fs from 'fs';
import pg from 'pg';

class App {
  private config: Config;
  private dbPool: pg.Pool;
  constructor(config: Config) {
    this.config = config;
    this.dbPool = new pg.Pool({
      host: this.config.dbHost,
      port: this.config.dbPort,
      user: this.config.dbUser,
      password: this.config.dbPassword,
      database: this.config.dbName,
      max: this.config.dbMax,
    });
  }

  public setup = async (): Promise<void> => {
    appLogger.info('Starting the application...');
    const connectionValidator = new ConnectionValidator(this.config, appLogger);
    await connectionValidator.validateConnections();
  };

  public start = async (): Promise<void> => {
    try {
      await this.setup();
    } catch (error) {
      appLogger.error(error);
      process.exit(1);
    }
  };
}

const env = dotenv.config({ path: 'configs/.env' }).parsed || {};
const configJson = parseJSONConfig(
  JSON.parse(fs.readFileSync('configs/config.json', 'utf-8'))
);
const config = new Config(env, configJson);
const app = new App(config);
app.start();
