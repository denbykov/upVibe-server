export class Config {
  public rabbitMQHost: string;
  public rabbitMQPort: string;
  public rabbitMQUser: string;
  public rabbitMQPassword: string;
  constructor(configEnv: JSON.JSONObject, config: JSON.JSONObject) {
    this.rabbitMQHost = configEnv.RABBITMQ_HOST || config.RABBITMQ_HOST;
    this.rabbitMQPort = configEnv.RABBITMQ_PORT || config.RABBITMQ_PORT;
    this.rabbitMQUser = configEnv.RABBITMQ_USERNAME || config.RABBITMQ_USERNAME;
    this.rabbitMQPassword = configEnv.RABBITMQ_PASSWORD || config.RABBITMQ_PASSWORD;
  }
}
