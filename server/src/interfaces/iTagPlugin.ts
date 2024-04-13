import { FileDTO } from '@src/dto/fileDTO';

export abstract class iTagPlugin {
  pluginName!: string;
  public abstract tagFile: (
    file: FileDTO,
    userId: string,
    source: string
  ) => Promise<void>;
  public abstract parseTags: (fileId: string, source: string) => Promise<void>;
}
