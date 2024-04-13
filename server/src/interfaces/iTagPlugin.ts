import { FileDTO } from '@src/dtos/fileDTO';

export abstract class iTagPlugin {
  pluginName!: string;
  public abstract tagFile: (
    file: FileDTO,
    userId: string,
    source: string
  ) => Promise<void>;
  public abstract parseTags: (fileId: string, source: string) => Promise<void>;
}
