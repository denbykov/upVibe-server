import { readdirSync } from 'fs';
import path from 'path';

export const pluginLoader = async (dirPath: string) => {
  const plugins = readdirSync(dirPath);

  for (const plugin of plugins) {
    console.log(`Loading plugin: ${path.join(dirPath, plugin)}`);
    console.log(await import(path.join(dirPath, plugin)));
    const { default: pluginClass } = await import(path.join(dirPath, plugin));
    console.log(pluginClass);
    const pluginObject = new pluginClass();
    pluginObject.init();
  }
};
