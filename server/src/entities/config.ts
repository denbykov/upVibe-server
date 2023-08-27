export class Config {
  public apiURI: string = '';
  public apiVersion: string = '';
  public apiAccessTokenSecret: string = '';
  public apiRefreshTokenSecret: string = '';
  public apiAccesTokenSecretExpires: string = '';
  public apiRefreshTokenSecretExpires: string = '';
  public appPort: number = 0;
  public appHost: string = '';
  public appUseHttps: boolean = false;
  public appHttpsKey: string = '';
  public appHttpsCert: string = '';
  public appPathStorage: string = '';
  public rabbitMQHost: string = '';
  public rabbitMQPort: number = 0;
  public rabbitMQUser: string = '';
  public rabbitMQPassword: string = '';
  public rabbitMQDownloadingYouTubeQueue: string = '';
  public rabbitMQTaggingYouTubeNativeQueue: string = '';
  public rabbitMQDownloadingYouTubeType: string = '';
  public rabbitMQTaggingYouTubeNativeType: string = '';
  public dbHost: string = '';
  public dbPort: number = 0;
  public dbUser: string = '';
  public dbPasswrd: string = '';
  public dbName: string = '';
  public dbMax: number = 0;
  constructor(configEnv: JSON.JSONObject, configJson: JSON.JSONObject) {
    this.apiURI =
      process.env.API_URI || configEnv.API_URI || configJson.API_URI;
    this.apiVersion =
      process.env.API_VERSION ||
      configEnv.API_VERSION ||
      configJson.API_VERSION;
    this.apiAccessTokenSecret =
      process.env.API_ACCESS_TOKEN_SECRET ||
      configEnv.API_ACCESS_TOKEN_SECRET ||
      configJson.API_ACCESS_TOKEN_SECRET;
    this.apiRefreshTokenSecret =
      process.env.API_REFRESH_TOKEN_SECRET ||
      configEnv.API_REFRESH_TOKEN_SECRET ||
      configJson.API_REFRESH_TOKEN_SECRET;
    this.apiAccesTokenSecretExpires =
      process.env.API_ACCESS_TOKEN_SECRET_EXPIRES ||
      configEnv.API_ACCESS_TOKEN_SECRET_EXPIRES ||
      configJson.API_ACCESS_TOKEN_SECRET_EXPIRES;
    this.apiRefreshTokenSecretExpires =
      process.env.API_REFRESH_TOKEN_SECRET_EXPIRES ||
      configEnv.API_REFRESH_TOKEN_SECRET_EXPIRES ||
      configJson.API_REFRESH_TOKEN_SECRET_EXPIRES;
    this.appPort =
      parseInt(<string>process.env.APP_PORT) ||
      parseInt(configEnv.APP_PORT) ||
      parseInt(configJson.APP_PORT);
    this.appHost =
      process.env.APP_HOST || configEnv.APP_HOST || configJson.APP_HOST;
    this.appUseHttps =
      process.env.APP_USE_HTTPS ||
      configEnv.APP_USE_HTTPS ||
      configJson.APP_USE_HTTPS;
    this.appHttpsKey =
      process.env.APP_HTTPS_KEY ||
      configEnv.APP_HTTPS_KEY ||
      configJson.APP_HTTPS_KEY;
    this.appHttpsCert =
      process.env.APP_HTTPS_CERT ||
      configEnv.APP_HTTPS_CERT ||
      configJson.APP_HTTPS_CERT;
    this.appPathStorage =
      process.env.APP_PATH_STORAGE ||
      configEnv.APP_PATH_STORAGE ||
      configJson.APP_PATH_STORAGE;
    this.dbHost =
      process.env.DB_HOST || configEnv.DB_HOST || configJson.DB_HOST;
    this.dbPort =
      parseInt(<string>process.env.DB_PORT) ||
      parseInt(configEnv.DB_PORT) ||
      configJson.DB_PORT;
    this.dbUser =
      process.env.DB_USER || configEnv.DB_USER || configJson.DB_USER;
    this.dbPasswrd =
      process.env.DB_PASSWORD ||
      configEnv.DB_PASSWORD ||
      configJson.DB_PASSWORD;
    this.dbName =
      process.env.DB_NAME || configEnv.DB_NAME || configJson.DB_NAME;
    this.dbMax =
      parseInt(<string>process.env.DB_MAX) ||
      parseInt(configEnv.DB_MAX) ||
      parseInt(configJson.DB_MAX);
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
    this.rabbitMQDownloadingYouTubeQueue =
      process.env.RABBITMQ_DOWNLOADING_YOUTUBE_QUEUE ||
      configEnv.RABBITMQ_DOWNLOADING_YOUTUBE_QUEUE ||
      configJson.RABBITMQ_DOWNLOADING_YOUTUBE_QUEUE;
    this.rabbitMQTaggingYouTubeNativeQueue =
      process.env.RABBITMQ_TAGGING_YOUTUBE_NATIVE_QUEUE ||
      configEnv.RABBITMQ_TAGGING_YOUTUBE_NATIVE_QUEUE ||
      configJson.RABBITMQ_TAGGING_YOUTUBE_NATIVE_QUEUE;
    this.rabbitMQDownloadingYouTubeType =
      process.env.RABBITMQ_DOWNLOADING_YOUTUBE_TYPE ||
      configEnv.RABBITMQ_DOWNLOADING_YOUTUBE_TYPE ||
      configJson.RABBITMQ_DOWNLOADING_YOUTUBE_TYPE;
    this.rabbitMQTaggingYouTubeNativeType =
      process.env.RABBITMQ_TAGGING_YOUTUBE_NATIVE_TYPE ||
      configEnv.RABBITMQ_TAGGING_YOUTUBE_NATIVE_TYPE ||
      configJson.RABBITMQ_TAGGING_YOUTUBE_NATIVE_TYPE;
  }
}
