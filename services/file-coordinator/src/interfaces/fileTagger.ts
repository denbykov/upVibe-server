import { ShortTagDTO } from '@dtos/shortTagDTO';

export abstract class FileTagger {
  public abstract tagFile: (path: string, tag: ShortTagDTO) => Promise<Buffer>;
}
