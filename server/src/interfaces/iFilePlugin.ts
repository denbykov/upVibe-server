import { FileDTO } from '@src/dto/fileDTO';

export abstract class iFilePlugin {
  pluginName!: string;
  public abstract getSource: (url: string) => Promise<number>;
  public abstract normalizeUrl: (url: string) => Promise<string>;
  public abstract downloadFile: (
    file: FileDTO,
    source: string
  ) => Promise<void>;
}
