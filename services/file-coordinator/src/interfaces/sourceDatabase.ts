import { SourceDTO } from '@dtos/sourceDTO';

export abstract class SourceDatabase {
  public abstract getSources(): Promise<Array<SourceDTO>>;
  public abstract getSource(sourceId: string): Promise<SourceDTO | null>;
  public abstract getSourcesWithParsingPermission(): Promise<Array<SourceDTO>>;
}
