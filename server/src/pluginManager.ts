import { readFileSync, readdirSync } from 'fs';
import { Logger } from 'log4js';
import path from 'path';

import { Config } from '@src/entities/config';
import { MergedIPlugin, PluginType, iPlugin } from '@src/interfaces/iPlugin';
import { parseJSONConfig } from '@src/utils/server/parseJSONConfig';

class PluginManager {
  private config: Config;
  public plugins: Map<PluginType, iPlugin> = new Map();
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
    const pluginDirectories = readdirSync(this.config.appPluginsLocation);
    const plugins = new Map<string, iPlugin>();
    const pluginConfig = parseJSONConfig(
      JSON.parse(readFileSync(this.config.appPluginsConfigLocation, 'utf8'))
    );
    for (const directory of pluginDirectories) {
      this.serverLogger.info(`Loading plugin ${directory}`);
      const { default: pluginClass } = await import(
        path.join(this.config.appPluginsLocation, directory)
      );
      const pluginInstance = new pluginClass(pluginConfig, this.dataLogger);
      this.serverLogger.info('Create plugin instance');
      plugins.set(pluginClass.pluginName, pluginInstance);
    }
    return plugins;
  };

  public getPlugin = (type: PluginType): MergedIPlugin => {
    return this.plugins.get(type) as MergedIPlugin;
  };

  public setUp = async (): Promise<void> => {
    const plugins = await this.loadPlugins();
    await this.registerPlugins(plugins);
  };
}

export { PluginManager };
