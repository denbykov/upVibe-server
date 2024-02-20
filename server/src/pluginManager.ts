import { readFileSync, readdirSync } from 'fs';
import { Logger } from 'log4js';
import path from 'path';

import { Config } from '@src/entities/config';
import {
  PluginType,
  iPlugin,
  iPluginManager,
} from '@src/interfaces/iPluginManager';
import { parseConfigJSON } from '@src/utils/server/parseConfigJSON';

class PluginManager implements iPluginManager {
  private plugins: Map<PluginType, iPlugin> = new Map();
  private config: Config;
  private static instance: PluginManager;
  public static PluginType = PluginType;
  private dataLogger: Logger;
  private serverLogger: Logger;
  constructor(config: Config, dataLogger: Logger, serverLogger: Logger) {
    this.config = config;
    this.dataLogger = dataLogger;
    this.serverLogger = serverLogger;
    this.serverLogger.info('PluginManager instance created');
    if (PluginManager.instance) {
      return PluginManager.instance;
    }
    PluginManager.instance = this;
  }

  public registerPlugins = async (
    plugins: Map<string, iPlugin>
  ): Promise<void> => {
    const pluginsMap = plugins;
    pluginsMap.forEach(async (plugin, name) => {
      this.plugins.set(name as PluginType, plugin as iPlugin);
      this.dataLogger.info(`Plugin ${name} registered`);
    });
  };

  public loadPlugins = async (): Promise<Map<string, iPlugin>> => {
    const pluginsFolderExclusions = ['utils', 'core', 'entities'];
    const pluginsDir = readdirSync(this.config.appPluginsLocation).filter(
      (file) => {
        return !pluginsFolderExclusions.includes(file);
      }
    );
    const plugins = new Map<string, iPlugin>();
    const pluginConfig = parseConfigJSON(
      JSON.parse(readFileSync(this.config.appPluginsConfigLocation, 'utf8'))
    );
    for (const plugin of pluginsDir) {
      this.serverLogger.info(`Loading plugin ${plugin}`);
      const { default: pluginClass } = await import(
        path.join(this.config.appPluginsLocation, plugin)
      );
      const pluginInstance = new pluginClass(pluginConfig, this.dataLogger);
      this.serverLogger.info('Create plugin instance');
      plugins.set(pluginClass.pluginName, pluginInstance);
    }
    return plugins;
  };

  public getPlugin = (type: PluginType): iPlugin | undefined => {
    return this.plugins.get(type);
  };

  public setUp = async (): Promise<void> => {
    const plugins = await this.loadPlugins();
    await this.registerPlugins(plugins);
  };
}

export { PluginManager };
