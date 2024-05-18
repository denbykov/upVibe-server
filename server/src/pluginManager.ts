import dotenv from 'dotenv';
import { readFileSync, readdirSync } from 'fs';
import { Logger } from 'log4js';
import path from 'path';

import { Config } from '@src/entities/config';
import { iFileCoordinatorPlugin } from '@src/interfaces/iFileCoordinatorPlugin';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';
import { parseJSONConfig } from '@src/utils/server/parseJSONConfig';

class PluginManager {
  private config: Config;
  private filePlugin: iFilePlugin | null;
  private tagPlugin: iTagPlugin | null;
  private fileCoordinatorPlugin: iFileCoordinatorPlugin | null;
  private static instance: PluginManager;
  private dataLogger: Logger;
  private serverLogger: Logger;

  constructor(config: Config, dataLogger: Logger, serverLogger: Logger) {
    this.config = config;
    this.dataLogger = dataLogger;
    this.serverLogger = serverLogger;
    this.filePlugin = null;
    this.tagPlugin = null;
    this.fileCoordinatorPlugin = null;
    if (PluginManager.instance) {
      return PluginManager.instance;
    }
    this.serverLogger.info('PluginManager instance created');
    PluginManager.instance = this;
  }

  private checkPlugins = (): void => {
    if (!this.filePlugin) {
      throw new Error('FilePlugin not registered');
    }
    if (!this.tagPlugin) {
      throw new Error('TagPlugin not registered');
    }
  };

  private registerPlugin = (
    plugin: iFilePlugin | iTagPlugin | iFileCoordinatorPlugin
  ): void => {
    const pluginMap = {
      FilePlugin: this.filePlugin,
      TagPlugin: this.tagPlugin,
      FileCoordinatorPlugin: this.fileCoordinatorPlugin,
    };

    if (pluginMap[plugin.pluginName as keyof typeof pluginMap]) {
      throw new Error(`${plugin.pluginName} already registered`);
    }

    switch (plugin.pluginName) {
      case 'FilePlugin':
        this.filePlugin = plugin as iFilePlugin;
        break;
      case 'TagPlugin':
        this.tagPlugin = plugin as iTagPlugin;
        break;
      case 'FileCoordinatorPlugin':
        this.fileCoordinatorPlugin = plugin as iFileCoordinatorPlugin;
        break;
      default:
        throw new Error(`Unknown plugin type ${plugin.pluginName}`);
    }
  };

  private loadPlugins = async (): Promise<void> => {
    const pluginDirectories = readdirSync(
      path.resolve(this.config.appPluginsLocation)
    );
    const envConfig = dotenv.config({ path: 'config/.env' }).parsed || {};
    const pluginConfig = parseJSONConfig(
      JSON.parse(readFileSync(this.config.appPluginsConfigLocation, 'utf8'))
    );

    for (const directory of pluginDirectories) {
      this.serverLogger.info(`Loading plugin ${directory}`);
      const { default: pluginClass } = await import(
        path.resolve(this.config.appPluginsLocation, directory)
      );
      const pluginInstance = new pluginClass(
        envConfig,
        pluginConfig,
        this.dataLogger
      );
      this.serverLogger.info('Create plugin instance');
      this.registerPlugin(pluginInstance);
    }
    this.checkPlugins();
  };

  public setUp = async (): Promise<void> => {
    await this.loadPlugins();
  };

  public getFilePlugin = (): iFilePlugin => {
    return this.filePlugin!;
  };

  public getTagPlugin = (): iTagPlugin => {
    return this.tagPlugin!;
  };
}

export { PluginManager };
