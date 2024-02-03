import { File } from '@src/entities/file';

export abstract class iTagPlugin {
  public abstract tagFile: (file: File) => Promise<void>;
}
