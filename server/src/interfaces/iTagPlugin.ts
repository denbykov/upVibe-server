import { FileDTO } from '@src/dto/fileDTO';

export abstract class iTagPlugin {
  pluginName!: string;
  public abstract tagFile: (
    file: FileDTO,
    userId: number,
    source: string
  ) => Promise<void>;
}
