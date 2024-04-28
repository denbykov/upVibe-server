interface TagMappingPriorityModel {
  source: string[];
  title: string[];
  artist: string[];
  album: string[];
  picture: string[];
  year: string[];
  trackNumber: string[];
}

export class Config {
  public appPort: number = 0;
  public appHost: string = '';
  public appUseHttps: boolean = false;
  public appHttpsKey: string = '';
  public appHttpsCert: string = '';
  public appPathStorage: string = '';
  public appPluginsLocation: string = '';
  public appPluginsConfigLocation: string = '';
  public appDebug: boolean = false;
  public tagMappingPriority: TagMappingPriorityModel = {
    source: ['1'],
    title: ['1'],
    artist: ['1'],
    album: ['1'],
    picture: ['1'],
    year: ['1'],
    trackNumber: ['1'],
  };
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
      process.env.APP_STORAGE_PATH ||
      configEnv.APP_STORAGE_PATH ||
      configJson.APP_STORAGE_PATH;
    this.appPluginsLocation =
      process.env.APP_PLUGINS_LOCATION ||
      configEnv.APP_PLUGINS_LOCATION ||
      configJson.APP_PLUGINS_LOCATION;
    this.appPluginsConfigLocation =
      process.env.APP_PLUGINS_CONFIG_LOCATION ||
      configEnv.APP_PLUGINS_CONFIG_LOCATION ||
      configJson.APP_PLUGINS_CONFIG_LOCATION;
    this.appDebug =
      process.env.APP_DEBUG === 'true' ||
      configEnv.APP_DEBUG === 'true' ||
      configJson.APP_DEBUG;
    this.tagMappingPriority = {
      source:
        process.env.TAG_MAPPING_PRIORITY_SOURCE ||
        configEnv.TAG_MAPPING_PRIORITY_SOURCE ||
        configJson.TAG_MAPPING_PRIORITY_SOURCE,
      title:
        process.env.TAG_MAPPING_PRIORITY_TITLE ||
        configEnv.TAG_MAPPING_PRIORITY_TITLE ||
        configJson.TAG_MAPPING_PRIORITY_TITLE,
      artist:
        process.env.TAG_MAPPING_PRIORITY_ARTIST ||
        configEnv.TAG_MAPPING_PRIORITY_ARTIST ||
        configJson.TAG_MAPPING_PRIORITY_ARTIST,
      album:
        process.env.TAG_MAPPING_PRIORITY_ALBUM ||
        configEnv.TAG_MAPPING_PRIORITY_ALBUM ||
        configJson.TAG_MAPPING_PRIORITY_ALBUM,
      picture:
        process.env.TAG_MAPPING_PRIORITY_PICTURE ||
        configEnv.TAG_MAPPING_PRIORITY_PICTURE ||
        configJson.TAG_MAPPING_PRIORITY_PICTURE,
      year:
        process.env.TAG_MAPPING_PRIORITY_YEAR ||
        configEnv.TAG_MAPPING_PRIORITY_YEAR ||
        configJson.TAG_MAPPING_PRIORITY_YEAR,
      trackNumber:
        process.env.TAG_MAPPING_PRIORITY_TRACK_NUMBER ||
        configEnv.TAG_MAPPING_PRIORITY_TRACK_NUMBER ||
        configJson.TAG_MAPPING_PRIORITY_TRACK_NUMBER,
    };
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
