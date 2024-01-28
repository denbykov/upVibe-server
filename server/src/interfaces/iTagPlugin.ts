import { UUID } from 'crypto';
import { Logger } from 'log4js';

import { Config } from '@src/entities/config';

export abstract class iTagPlugin {
  protected config: Config;
  protected logger: Logger;
  constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }
  public abstract downloadFile: (
    fileId: number,
    sourceUrl: string,
    destinationPath: UUID
  ) => Promise<void>;
}
