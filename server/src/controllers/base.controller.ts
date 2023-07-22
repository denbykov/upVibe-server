import { Config } from "@src/entities/config";

class BaseController {
  protected apiURI: string;
  protected apiURIAuth: string;
  protected _config: Config;
  constructor(config: Config) {
    this.apiURI = `/${config.apiURI}/${config.apiVersion}`;
    this.apiURIAuth = `/${config.apiURI}/${config.apiVersion}/auth`;
    this._config = config;
  }
}

export { BaseController };
