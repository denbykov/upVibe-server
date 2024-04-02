import { Source } from '@src/entities/source';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { dataLogger } from '@src/utils/server/logger';

import { ProcessingError } from './processingError';

export class SourceWorker {
  private db: iSourceDatabase;

  constructor(db: iSourceDatabase) {
    this.db = db;
    dataLogger.trace('SourceWorker initialized');
  }

  public getSources = async (): Promise<Array<Source>> => {
    const sources = await this.db.getSources();
    return sources.map((source) => {
      return source.toEntity();
    });
  };

  public getSourceLogo = async (sourceId: number): Promise<string> => {
    const source = await this.db.getSource(sourceId);

    if (!source) {
      throw new ProcessingError('Source not found');
    }
    return source.logoPath;
  };
}
