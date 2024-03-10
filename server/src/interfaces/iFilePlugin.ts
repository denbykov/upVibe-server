import { FileDTO } from '@src/dto/file';

export abstract class iFilePlugin {
  public abstract getSourceDescription: (url: string) => Promise<string>;
  public abstract getCorrectUrl: (url: string) => Promise<string>;
  public abstract downloadFile: (
    file: FileDTO,
    source: string
  ) => Promise<void>;
}
