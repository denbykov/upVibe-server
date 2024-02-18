import { Response, ResponseCode } from '@src/entities/response';
import { dataLogger } from '@src/utils/server/logger';

class ErrorManager {
  public static logError = (message: string): void => {
    dataLogger.error(message);
  };

  public static responseError = (
    logMessage: string,
    message: string,
    errorCode: ResponseCode
  ): Response => {
    ErrorManager.logError(logMessage);
    return new Response(errorCode, message, -1);
  };
}

export { ErrorManager };
