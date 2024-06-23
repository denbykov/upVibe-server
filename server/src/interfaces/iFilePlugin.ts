import { FileDTO } from '@src/dtos/fileDTO';

export abstract class iFilePlugin {
  pluginName!: string;
  public abstract getSource: (url: string) => Promise<string>;
  public abstract normalizeUrl: (url: string) => Promise<string>;
  public abstract normalizeUrlPlaylist: (url: string) => string;
  public abstract downloadFile: (
    file: FileDTO,
    source: string
  ) => Promise<void>;
}
