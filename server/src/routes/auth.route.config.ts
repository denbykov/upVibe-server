import express from "express";
import { AuthController } from "@src/controllers";
import { CommonRoutesConfig } from "./base.route";
import { Config } from "@src/entities/config";

export class AuthRoute extends CommonRoutesConfig {
  constructor(app: express.Application, config: Config) {
    super(app, "AuthRoute", config, new AuthController(config));
  }
  configureRoutes() {
    this.app.post(`${this.controller.apiURIAuth}/login`, this.controller.login);
    this.app.post(
      `${this.controller.apiURIAuth}/refresh-token`,
      this.controller.refreshToken
    );
    return this.app;
  }
}
