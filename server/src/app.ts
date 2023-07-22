import express, { Express } from 'express'
import { APIRoute, AuthRoute, CommonRoutesConfig } from '@src/routes'
import { requestLogger } from '@src/middlewares'
import { Config } from './entities/config'

export class App {
    private readonly app: Express
    private routes: Array<CommonRoutesConfig> = []
    constructor(config: Config) {
        this.app = express()
        this.app.use(express.json())
        this.app.use(requestLogger)
        this.routes.push(new APIRoute(this.app, config))
        this.routes.push(new AuthRoute(this.app, config))
    }
    public getApp(): Express {
        return this.app
    }

    public getRoutes(): Array<CommonRoutesConfig> {
        return this.routes
    }
}
