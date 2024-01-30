export class ConfigPlugin {
  public rabbitMQHost: string;
  public rabbitMQPort: string;
  public rabbitMQUser: string;
  public rabbitMQPassword: string;
  constructor(configEnv: JSON.JSONObject, configJson: JSON.JSONObject) {
    this.rabbitMQHost =
      process.env.RABBITMQ_HOST ||
      configJson.RABBITMQ_HOST ||
      configEnv.RABBITMQ_HOST;
    this.rabbitMQPort =
      process.env.RABBITMQ_PORT ||
      configJson.RABBITMQ_PORT ||
      configEnv.RABBITMQ_PORT;
    this.rabbitMQUser =
      process.env.RABBITMQ_USERNAME ||
      configJson.RABBITMQ_USERNAME ||
      configEnv.RABBITMQ_USERNAME;
    this.rabbitMQPassword =
      process.env.RABBITMQ_PASSWORD ||
      configJson.RABBITMQ_PASSWORD ||
      configEnv.RABBITMQ_PASSWORD;
  }
}
