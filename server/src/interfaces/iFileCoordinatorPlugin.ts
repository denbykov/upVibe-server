export abstract class iFileCoordinatorPlugin {
  pluginName!: string;
  public abstract coordinateFile(fileId: string): void;
}
