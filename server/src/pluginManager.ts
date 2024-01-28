import { Logger } from 'log4js';

import {
  PluginType,
  iPlugin,
  iPluginManager,
} from '@src/interfaces/iPluginManager';

class PluginManager implements iPluginManager {
  private plugins: Map<PluginType, iPlugin> = new Map();
  private static instance: PluginManager;
  public static PluginType = PluginType;
  private dataLogger!: Logger;
  constructor(dataLogger: Logger) {
    if (PluginManager.instance) {
      return PluginManager.instance;
    }
    PluginManager.instance = this;
    this.dataLogger = dataLogger;
    this.dataLogger.info('PluginManager instance created');
  }

  public registerPlugin = async (plugins: Map<string, any>): Promise<void> => {
    const pluginsMap = await plugins;
    await pluginsMap.forEach(async (plugin, name) => {
      await this.plugins.set(name as PluginType, plugin as iPlugin);
      this.dataLogger.info(`Plugin ${name} registered`);
    });
  };

  public getPlugin = (type: PluginType): iPlugin | undefined => {
    return this.plugins.get(type);
  };

  public getPlugins = (): Map<PluginType, iPlugin> => {
    return this.plugins;
  };
}

export default PluginManager;
