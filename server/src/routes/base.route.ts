import { Config } from "@src/entities/config";
import express from "express";

export abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;
  config: Config;
  controller: any;
  constructor(
    app: express.Application,
    name: string,
    config: Config,
    controller: any
  ) {
    this.app = app;
    this.name = name;
    this.config = config;
    this.controller = controller;
    this.configureRoutes();
  }
  getName = () => {
    return this.name;
  };
  abstract configureRoutes(): express.Application;
}
