import { FileDTO } from '@src/dto/file';

export abstract class iTagPlugin {
  public abstract tagFile: (
    file: FileDTO,
    userId: number,
    routingKey: string
  ) => Promise<void>;
}
