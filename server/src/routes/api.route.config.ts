import express from "express";
import { CommonRoutesConfig } from "./base.route";
import { APIController } from "@src/controllers";
import { auth0Middleware } from "@src/middlewares";
import { Config } from "@src/entities/config";

export class APIRoute extends CommonRoutesConfig {
  constructor(app: express.Application, config: Config) {
    super(app, "APIRoute", config, new APIController(config));
  }
  configureRoutes() {
    this.app.get(`${this.controller.apiURI}/info`, this.controller.getInfo);
    this.app.get(
      `${this.controller.apiURI}/auth-test`,
      auth0Middleware(this.config),
      this.controller.authTest
    );
    return this.app;
  }
}
