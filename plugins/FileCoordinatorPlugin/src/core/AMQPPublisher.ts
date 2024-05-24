import { Config } from '@/entities/config';
import amqp, { Connection } from 'amqplib/callback_api';
import { Logger } from 'log4js';

export class AMQPPublisher {
  protected config: Config;
  protected dataLogger: Logger;
  constructor(config: Config, dataLogger: Logger) {
    this.config = config;
    this.dataLogger = dataLogger;
  }

  public publish = (queue: string, payload: Record<string, unknown>) => {
    amqp.connect(
      `amqp://${this.config.rabbitMQUser}:${this.config.rabbitMQPassword}@${this.config.rabbitMQHost}:${this.config.rabbitMQPort}`,
      (error, connection: Connection) => {
        if (error) {
          this.dataLogger.error(`[RabbitMQ] ${error}`);
          throw error;
        }
        connection.createChannel((errorChannel, channel) => {
          if (errorChannel) {
            this.dataLogger.error(errorChannel);
            throw errorChannel;
          }
          const msg = JSON.stringify(payload);
          channel.assertQueue(queue, {
            durable: true,
          });

          channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true,
            deliveryMode: true,
          });
          this.dataLogger.debug(`[RabbitMQ] Sent to ${queue} ${msg}`);
        });

        setTimeout(() => {
          connection.close();
        }, 500);
      }
    );
  };
}
