import { File } from '@src/entities/file';

export abstract class iFilePlugin {
  public abstract downloadFile: (file: File) => Promise<void>;
}
