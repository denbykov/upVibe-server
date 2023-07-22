import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Config } from "@src/entities/config";

class APIController extends BaseController {
  constructor(config: Config) {
    super(config);
  }

  public getInfo = async (req: Request, res: Response) => {
    return res.send({
      message: `Welcome to ${this._config.apiURI} API! Version: ${this._config.apiVersion} 🚀 `,
      _error: 0,
    });
  };

  public authTest = async (req: Request, res: Response) => {
    return res.send({
      message: "Auth test passed!",
      _error: 0,
    });
  };
}

export { APIController };
