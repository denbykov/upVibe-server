export class Config {
    public apiURI: string = ''
    public apiVersion: string = ''
    public apiAccessTokenSecret: string = ''
    public apiRefreshTokenSecret: string = ''
    public apiAccesTokenSecretExpires: string = ''
    public apiRefreshTokenSecretExpires: string = ''
    public appPort: number = 0
    public appHost: string = ''
    public dbHost: string = ''
    public dbPort: number = 0
    public dbUser: string = ''
    public dbPasswrd: string = ''
    public dbName: string = ''
    constructor(configEnv: JSON.JSONObject, configJson: JSON.JSONObject) {
        this.apiURI = configEnv.API_URI || configJson.API_URI
        this.apiVersion = configEnv.API_VERSION || configJson.API_VERSION
        this.apiAccessTokenSecret =
            configEnv.API_ACCESS_TOKEN_SECRET ||
            configJson.API_ACCESS_TOKEN_SECRET
        this.apiRefreshTokenSecret =
            configEnv.API_REFRESH_TOKEN_SECRET ||
            configJson.API_REFRESH_TOKEN_SECRET
        this.apiAccesTokenSecretExpires =
            configEnv.API_ACCESS_TOKEN_SECRET_EXPIRES ||
            configJson.API_ACCESS_TOKEN_SECRET_EXPIRES
        this.apiRefreshTokenSecretExpires =
            configEnv.API_REFRESH_TOKEN_SECRET_EXPIRES ||
            configJson.API_REFRESH_TOKEN_SECRET_EXPIRES
        this.appPort = parseInt(configEnv.APP_PORT) || configJson.APP_PORT
        this.appHost = configEnv.APP_HOST || configJson.APP_HOST
        this.dbHost = configEnv.DB_HOST || configJson.DB_HOST
        this.dbPort = parseInt(configEnv.DB_PORT) || configJson.DB_PORT
        this.dbUser = configEnv.DB_USER || configJson.DB_USER
        this.dbPasswrd = configEnv.DB_PASSWORD || configJson.DB_PASSWORD
        this.dbName = configEnv.DB_NAME || configJson.DB_NAME
    }
}
