import { File } from '@src/entities/file';

export abstract class iFileDatabase {
  public abstract getFiles: (usersId: number) => Promise<File[] | null>;
  public abstract getSources: () => Promise<JSON.JSONObject[] | null>;
  public abstract getSource: (
    sourceId: number
  ) => Promise<JSON.JSONObject | null>;
}
