import { Config } from '@entities/config';
import amqp from 'amqplib';
import { Logger } from 'log4js';
import pg from 'pg';

class ConnectionValidator {
  private config: Config;
  private appLogger: Logger;

  constructor(config: Config, appLogger: Logger) {
    this.config = config;
    this.appLogger = appLogger;
  }

  public validateRabbitMQ = async (): Promise<boolean> => {
    try {
      const connection = await amqp.connect({
        hostname: this.config.rabbitMQHost,
        port: this.config.rabbitMQPort,
        username: this.config.rabbitMQUser,
        password: this.config.rabbitMQPassword,
      });

      await connection.close();
      this.appLogger.info('RabbitMQ connection is successful');

      return true;
    } catch (error) {
      this.appLogger.error('RabbitMQ connection failed');
      return false;
    }
  };

  public validatePostgres = async (): Promise<boolean> => {
    try {
      const client = new pg.Client({
        host: this.config.dbHost,
        port: this.config.dbPort,
        user: this.config.dbUser,
        password: this.config.dbPassword,
        database: this.config.dbName,
      });

      await client.connect();
      await client.end();
      this.appLogger.info('Postgres connection is successful');

      return true;
    } catch (error) {
      this.appLogger.error('Postgres connection failed');
      return false;
    }
  };

  public validateConnections = async (): Promise<void> => {
    const rabbitMQConnection = await this.validateRabbitMQ();
    const postgresConnection = await this.validatePostgres();

    if (!rabbitMQConnection || !postgresConnection) {
      throw new Error('Connection validation failed');
    }
  };
}

export { ConnectionValidator };
