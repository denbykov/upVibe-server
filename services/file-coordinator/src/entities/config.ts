class Config {
  public rabbitMQHost: string = '';
  public rabbitMQPort: number = 0;
  public rabbitMQUser: string = '';
  public rabbitMQPassword: string = '';
  public dbHost: string = '';
  public dbPort: number = 0;
  public dbUser: string = '';
  public dbPassword: string = '';
  public dbName: string = '';
  public dbMax: number = 0;
  public uvServerHost: string = '';
  public uvServerPort: number = 0;

  constructor(configEnv: JSON.JSONObject, configJson: JSON.JSONObject) {
    this.rabbitMQHost =
      process.env.RABBITMQ_HOST ||
      configEnv.RABBITMQ_HOST ||
      configJson.RABBITMQ_HOST;
    this.rabbitMQPort =
      parseInt(<string>process.env.RABBITMQ_PORT) ||
      parseInt(configEnv.RABBITMQ_PORT) ||
      parseInt(configJson.RABBITMQ_PORT);
    this.rabbitMQUser =
      process.env.RABBITMQ_USER ||
      configEnv.RABBITMQ_USER ||
      configJson.RABBITMQ_USER;
    this.rabbitMQPassword =
      process.env.RABBITMQ_PASSWORD ||
      configEnv.RABBITMQ_PASSWORD ||
      configJson.RABBITMQ_PASSWORD;
    this.dbHost =
      process.env.DB_HOST || configEnv.DB_HOST || configJson.DB_HOST;
    this.dbPort =
      parseInt(<string>process.env.DB_PORT) ||
      parseInt(configEnv.DB_PORT) ||
      configJson.DB_PORT;
    this.dbUser =
      process.env.DB_USER || configEnv.DB_USER || configJson.DB_USER;
    this.dbPassword =
      process.env.DB_PASSWORD ||
      configEnv.DB_PASSWORD ||
      configJson.DB_PASSWORD;
    this.dbName =
      process.env.DB_NAME || configEnv.DB_NAME || configJson.DB_NAME;
    this.dbMax =
      parseInt(<string>process.env.DB_MAX) ||
      parseInt(configEnv.DB_MAX) ||
      parseInt(configJson.DB_MAX);
    this.uvServerHost =
      process.env.UV_SERVER_HOST ||
      configEnv.UV_SERVER_HOST ||
      configJson.UV_SERVER_HOST;
    this.uvServerPort =
      parseInt(<string>process.env.UV_SERVER_PORT) ||
      parseInt(configEnv.UV_SERVER_PORT) ||
      parseInt(configJson.UV_SERVER_PORT);
  }
}

export { Config };
