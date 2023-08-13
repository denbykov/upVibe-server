import amqp, { Connection } from 'amqplib/callback_api';

import { Config } from '@src/entities/config';
import { dataLogger } from '@src/utils/server/logger';

export class PublisherAMQP {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  public publishDownloadingQueue = (
    queue: string,
    payload: JSON.JSONObject
  ) => {
    amqp.connect(
      `amqp://${this.config.rabbitMQUser}:${this.config.rabbitMQPassword}@${this.config.rabbitMQHost}:${this.config.rabbitMQPort}`,
      (error, connection: Connection) => {
        if (error) {
          dataLogger.error(error);
          throw error;
        }
        connection.createChannel((errorChannel, channel) => {
          if (errorChannel) {
            dataLogger.error(errorChannel);
            throw errorChannel;
          }
          const msg = JSON.stringify(payload);
          channel.assertQueue(queue, {
            durable: false,
          });
          channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true,
          });
          dataLogger.debug(`[RabbitMQ] Sent ${msg}`);
        });
        setTimeout(() => {
          connection.close();
        }, 500);
      }
    );
  };
}
