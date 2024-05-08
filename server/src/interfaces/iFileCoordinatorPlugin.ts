import { UUID } from 'crypto';

export abstract class iFileCoordinatorPlugin {
  pluginName!: string;
  public abstract coordinateFile(
    fileId: string,
    userId: string,
    deviceId: UUID
  ): void;
}
