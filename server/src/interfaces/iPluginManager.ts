import { iFilePlugin } from './iFilePlugin';
import { iTagPlugin } from './iTagPlugin';

export enum PluginType {
  FilePlugin = 'FilePlugin',
  TagPlugin = 'TagPlugin',
}
export type iPlugin = iFilePlugin | iTagPlugin;

export abstract class iPluginManager {
  public static PluginType: PluginType;
  public abstract loadPlugins: () => Promise<Map<string, iPlugin>>;
  public abstract registerPlugins: (
    plugins: Map<string, iPlugin>
  ) => Promise<void>;
  public abstract getPlugin: (type: PluginType) => iPlugin | undefined;
  public abstract setUp: () => Promise<void>;
}
