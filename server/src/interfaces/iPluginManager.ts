import { iFilePlugin } from './iFilePlugin';
import { iTagPlugin } from './iTagPlugin';

export enum PluginType {
  FilePlugin = 'FilePlugin',
  TagPlugin = 'TagPlugin',
}
export type iPlugin = iFilePlugin | iTagPlugin;

export abstract class iPluginManager {
  public static PluginType: PluginType;
  public abstract registerPlugin: (plugins: Map<string, any>) => Promise<void>;
  public abstract getPlugin: (type: PluginType) => iPlugin | undefined;
  public abstract getPlugins: () => Map<PluginType, iPlugin>;
}
