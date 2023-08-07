import amqp, { Connection } from 'amqplib/callback_api';

import { Config } from '@src/entities/config';
import { dataLogger } from '@src/utils/server/logger';

export class PublisherMQTTRepository {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  public publish = (payload: JSON.JSONObject) => {
    amqp.connect(
      `amqp://${this.config.appBrockerUser}:${this.config.appBrockerPassword}@${this.config.appBrockerHost}:${this.config.appBrockerPort}`,
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
          const queue = this.config.appBrockerQueue;
          const msg = JSON.stringify(payload);
          channel.assertQueue(queue, {
            durable: true,
          });
          channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true,
          });
          dataLogger.info(`[RabbitMQ] Sent ${msg}`);
        });
        setTimeout(() => {
          connection.close();
        }, 500);
      }
    );
  };
}
