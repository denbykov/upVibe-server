import { Config } from '@src/entities/config';
import express from 'express';
import pg from 'pg';

export abstract class BaseRoute {
  app: express.Application;
  name: string;
  config: Config;
  databasePool: pg.Pool;
  controller: any;
  constructor(
    app: express.Application,
    name: string,
    config: Config,
    databasePool: pg.Pool,
    controller: any
  ) {
    this.app = app;
    this.name = name;
    this.config = config;
    this.databasePool = databasePool;
    this.controller = controller;
    this.configureRoutes();
  }
  getName = () => {
    return this.name;
  };
  abstract configureRoutes(): express.Application;
}
