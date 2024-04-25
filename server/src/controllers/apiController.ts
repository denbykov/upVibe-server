import Express from 'express';

import { ApiWorker } from '@src/business/apiWorker';
import { UserWorker } from '@src/business/userWorker';
import { UserInfoAgent, UserRepository } from '@src/data';
import { DBManager } from '@src/dbManager';
import { DeviceDTO } from '@src/dtos/deviceDTO';
import { Config } from '@src/entities/config';
import { SQLManager } from '@src/sqlManager';
import { APP_VERSION } from '@src/version';

import { BaseController } from './baseController';

class APIController extends BaseController {
  constructor(config: Config, dbManager: DBManager, sqlManager: SQLManager) {
    super(config, dbManager, sqlManager);
  }

  private buildUserWorker = (): UserWorker => {
    return new UserWorker(
      new UserRepository(this.dbManager, this.sqlManager),
      new UserInfoAgent(this.config)
    );
  };

  private buildApiWorker = (): ApiWorker => {
    return new ApiWorker();
  };

  public healthCheck = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      return response.status(200).json({
        message: 'API is healthy!',
      });
    } catch (error) {
      next(error);
    }
  };

  public getInfo = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      return response.status(200).json({
        version: `${APP_VERSION}`,
      });
    } catch (error) {
      next(error);
    }
  };

  public authTest = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      return response.status(200).json({
        message: 'Auth test passed!',
      });
    } catch (error) {
      next(error);
    }
  };

  public register = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const rawToken = request.headers.authorization!.split(' ')[1];
      const encodedTokenPayload = rawToken.split('.')[1];
      const tokenPayload: JSON.JSONObject = JSON.parse(
        Buffer.from(encodedTokenPayload!, 'base64').toString('ascii')
      );
      const userWorker = this.buildUserWorker();
      await userWorker.handleRegistration(
        rawToken,
        tokenPayload.sub,
        DeviceDTO.fromRequestJSON(request.body)
      );
      return response.status(200).json({
        message: 'Device registered!',
      });
    } catch (error) {
      next(error);
    }
  };

  public getSwaggerSpec = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const apiWorker = this.buildApiWorker();
      const swaggerSpec = await apiWorker.getSwaggerSpec();
      return response.status(200).json(swaggerSpec);
    } catch (error) {
      next(error);
    }
  };
}

export { APIController };
