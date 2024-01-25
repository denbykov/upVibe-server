import { readdirSync } from 'fs';
import { Logger } from 'log4js';
import path from 'path';

export const pluginLoader = async (
  dirPath: string,
  serverLogger: Logger
): Promise<Map<string, any>> => {
  const pluginsDir = readdirSync(dirPath).filter((file) => file != 'utils');
  const plugins = new Map<string, any>();
  for (const plugin of pluginsDir) {
    const { default: pluginClass } = await import(path.join(dirPath, plugin));
    serverLogger.info(`Loading plugin ${plugin}`);
    serverLogger.info(`Loaded plugin ${pluginClass.pluginName}`);
    plugins.set(pluginClass.pluginName, pluginClass);
  }
  return plugins;
};
