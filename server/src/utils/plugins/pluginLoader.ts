import { readdirSync } from 'fs';
import { Logger } from 'log4js';
import path from 'path';

import { ConfigPlugin } from '@src/entities/configPlugin';
import { iPlugin } from '@src/interfaces/iPluginManager';

export const pluginLoader = async (
  dirPath: string,
  config: ConfigPlugin,
  serverLogger: Logger,
  dataLogger: Logger
): Promise<Map<string, iPlugin>> => {
  const pluginsFolderExclusions = ['utils', 'core', 'entities'];
  const pluginsDir = readdirSync(dirPath).filter((file) => {
    return !pluginsFolderExclusions.includes(file);
  });
  const plugins = new Map<string, iPlugin>();
  for (const plugin of pluginsDir) {
    const { default: pluginClass } = await import(path.join(dirPath, plugin));
    serverLogger.info(`Loading plugin ${plugin}`);
    serverLogger.info(`Loaded plugin ${pluginClass.pluginName}`);
    serverLogger.info('Create plugin instance');
    const pluginInstance = new pluginClass(config, dataLogger);
    plugins.set(pluginClass.pluginName, pluginInstance);
  }
  return plugins;
};
