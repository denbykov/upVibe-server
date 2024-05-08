import { UUID } from "crypto";

export abstract class iFileCoordinatorPlugin {
  public abstract coordinateFile(fileId: string, userId: string, deviceId: UUID): void;
}
