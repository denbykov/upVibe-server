import { File } from '@src/entities/file';

export abstract class iFilePlugin {
  public abstract getSourceDescription: (url: string) => Promise<string>;
  public abstract getCorrectUrl: (url: string) => Promise<string>;
  public abstract downloadFile: (file: File) => Promise<void>;
}
