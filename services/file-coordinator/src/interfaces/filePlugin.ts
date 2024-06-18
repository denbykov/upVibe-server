import { FileDTO } from '@dtos/fileDTO';

export abstract class FilePlugin {
  pluginName!: string;
  public abstract getSource: (url: string) => Promise<string>;
  public abstract normalizeUrl: (url: string) => Promise<string>;
  public abstract requestFileProcessing: (
    url: string,
    userId: string,
    playlistId: string,
  ) => Promise<void>;
  public abstract downloadFile: (file: FileDTO, routingKey: string) => void;
}
