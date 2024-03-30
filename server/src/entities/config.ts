export class Config {
  public apiURI: string = '';
  public apiVersion: string = '';
  public appPort: number = 0;
  public appHost: string = '';
  public appUseHttps: boolean = false;
  public appHttpsKey: string = '';
  public appHttpsCert: string = '';
  public appPathStorage: string = '';
  public appPluginsLocation: string = '';
  public appPluginsConfigLocation: string = '';
  public auth0Audience: string = '';
  public auth0Domain: string = '';
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

  constructor(configEnv: JSON.JSONObject, configJson: JSON.JSONObject) {
    this.apiURI =
      process.env.API_URI || configEnv.API_URI || configJson.API_URI;
    this.apiVersion =
      process.env.API_VERSION ||
      configEnv.API_VERSION ||
      configJson.API_VERSION;
    this.appPort =
      parseInt(<string>process.env.APP_PORT) ||
      parseInt(configEnv.APP_PORT) ||
      parseInt(configJson.APP_PORT);
    this.appHost =
      process.env.APP_HOST || configEnv.APP_HOST || configJson.APP_HOST;
    this.appUseHttps =
      process.env.APP_USE_HTTPS === 'true' ||
      configEnv.APP_USE_HTTPS === 'true' ||
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
    this.appPluginsLocation =
      process.env.APP_PLUGINS_LOCATION ||
      configEnv.APP_PLUGINS_LOCATION ||
      configJson.APP_PLUGINS_LOCATION;
    this.appPluginsConfigLocation =
      process.env.APP_PLUGINS_CONFIG_LOCATION ||
      configEnv.APP_PLUGINS_CONFIG_LOCATION ||
      configJson.APP_PLUGINS_CONFIG_LOCATION;
    this.auth0Audience =
      process.env.AUTH0_AUDIENCE ||
      configEnv.AUTH0_AUDIENCE ||
      configJson.AUTH0_AUDIENCE;
    this.auth0Domain =
      process.env.AUTH0_DOMAIN ||
      configEnv.AUTH0_DOMAIN ||
      configJson.AUTH0_DOMAIN;
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
  }
}
