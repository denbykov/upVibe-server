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

  public validateRabbitMQ = async (
    amqpConfigConnection: string
  ): Promise<boolean> => {
    try {
      const connection = await amqp.connect(amqpConfigConnection);

      await connection.close();
      this.appLogger.info('RabbitMQ connection is successful');

      return true;
    } catch (error) {
      this.appLogger.error('RabbitMQ connection failed');
      return false;
    }
  };

  public validatePostgres = async (dbPool: pg.Pool): Promise<boolean> => {
    try {
      const client = await dbPool.connect();
      await client.query('SELECT NOW()');
      client.release();
      this.appLogger.info('Postgres connection is successful');

      return true;
    } catch (error) {
      this.appLogger.error('Postgres connection failed');
      return false;
    }
  };

  public validateConnections = async (
    dbPool: pg.Pool,
    amqpConfigConnection: string
  ): Promise<void> => {
    const postgresConnection = await this.validatePostgres(dbPool);
    const rabbitMQConnection =
      await this.validateRabbitMQ(amqpConfigConnection);

    if (!rabbitMQConnection || !postgresConnection) {
      throw new Error('Connection validation failed');
    }
  };
}

export { ConnectionValidator };
