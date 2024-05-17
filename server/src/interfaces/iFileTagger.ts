import { ShortTagDTO } from '@src/dtos/shortTagDTO';

export abstract class iFileTagger {
  public abstract tagFile: (path: string, tag: ShortTagDTO) => Promise<Buffer>;
}
