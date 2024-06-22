import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { Config } from '@entities/config';
import { FilePlugin } from '@interfaces/filePlugin';
import { TagPlugin } from '@interfaces/tagPlugin';
import { parseJSONConfig } from '@utils/parseJSONConfig';
import dotenv from 'dotenv';
import { Logger } from 'log4js';

class PluginManager {
  private config: Config;
  private filePlugin: FilePlugin | null;
  private tagPlugin: TagPlugin | null;
  private static instance: PluginManager;
  private dataLogger: Logger;
  private serverLogger: Logger;

  constructor(config: Config, dataLogger: Logger, serverLogger: Logger) {
    this.config = config;
    this.dataLogger = dataLogger;
    this.serverLogger = serverLogger;
    this.filePlugin = null;
    this.tagPlugin = null;
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

  private registerPlugin = (plugin: FilePlugin | TagPlugin): void => {
    const pluginMap = {
      FilePlugin: this.filePlugin,
      TagPlugin: this.tagPlugin,
    };

    if (pluginMap[plugin.pluginName as keyof typeof pluginMap]) {
      throw new Error(`${plugin.pluginName} already registered`);
    }

    switch (plugin.pluginName) {
      case 'FilePlugin':
        this.filePlugin = plugin as FilePlugin;
        break;
      case 'TagPlugin':
        this.tagPlugin = plugin as TagPlugin;
        break;
      default:
        throw new Error(`Unknown plugin type ${plugin.pluginName}`);
    }
  };

  private loadPlugins = async (): Promise<void> => {
    const pluginDirectories = readdirSync(
      path.resolve(this.config.appPluginsLocation),
    );
    const envConfig = dotenv.config({ path: 'config/.env' }).parsed || {};
    const pluginConfig = parseJSONConfig(
      JSON.parse(readFileSync(this.config.appPluginsConfigLocation, 'utf8')),
    );

    for (const directory of pluginDirectories) {
      this.serverLogger.info(`Loading plugin ${directory}`);
      const { default: pluginClass } = await import(
        path.resolve(this.config.appPluginsLocation, directory)
      );
      const pluginInstance = new pluginClass(
        envConfig,
        pluginConfig,
        this.dataLogger,
      );
      this.serverLogger.info('Create plugin instance');
      this.registerPlugin(pluginInstance);
    }
    this.checkPlugins();
  };

  public setUp = async (): Promise<void> => {
    await this.loadPlugins();
  };

  public getFilePlugin = (): FilePlugin => {
    return this.filePlugin!;
  };

  public getTagPlugin = (): TagPlugin => {
    return this.tagPlugin!;
  };
}

export { PluginManager };
