import { AuthWorker } from "@src/business/authWorker";
import { Database } from "@src/data";
import { Config } from "@src/entities/config";
import Express from "express";

const auth0Middleware = (config: Config) => {
  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const authWorker = new AuthWorker(await new Database(config), config);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).send({
        message: "Token invalid",
        _error: 1,
      });
    }
    const token = authHeader.split(" ")[1];
    const auth = await authWorker.auth(token);
    if (!auth) {
      return res.status(403).send({
        message: "Token invalid",
        _error: 1,
      });
    }
    next();
  };
};

export default auth0Middleware;
