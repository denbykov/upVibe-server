import { readdirSync } from 'fs';
import { Logger } from 'log4js';
import path from 'path';

export const pluginLoader = async (dirPath: string, serverLogger: Logger) => {
  const plugins = readdirSync(dirPath);

  for (const plugin of plugins) {
    const { default: pluginClass } = await import(path.join(dirPath, plugin));
    serverLogger.info(`Loading plugin ${plugin}`);
    const pluginObject = new pluginClass();
    pluginObject.init();
    serverLogger.info(`Loaded plugin ${plugin}`);
  }
};
