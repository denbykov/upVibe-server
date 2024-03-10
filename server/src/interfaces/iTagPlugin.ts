import { FileDTO } from '@src/dto/file';

export abstract class iTagPlugin {
  public abstract tagFile: (
    file: FileDTO,
    userId: number,
    source: string
  ) => Promise<void>;
}
