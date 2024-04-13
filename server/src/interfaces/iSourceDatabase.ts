import { SourceDTO } from '@src/dtos/sourceDTO';

export abstract class iSourceDatabase {
  public abstract getSources(): Promise<Array<SourceDTO>>;
  public abstract getSource(sourceId: string): Promise<SourceDTO | null>;
  public abstract getSourcesWithParsingPermission(): Promise<Array<SourceDTO>>;
}
