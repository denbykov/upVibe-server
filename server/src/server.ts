import dotenv from 'dotenv';
import fs from 'fs';

import { App } from '@src/app';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { dataLogger, serverLogger } from '@src/utils/server/logger';
import { parseConfigJSON } from '@src/utils/server/parseConfigJSON';

const env = dotenv.config({ path: 'config/.env' }).parsed || {};
const configJson = parseConfigJSON(
  JSON.parse(fs.readFileSync('config/config.json', 'utf-8'))
);

const config = new Config(env, configJson);
const pluginManager = new PluginManager(config, dataLogger, serverLogger);

(async () => {
  await pluginManager.setUp();
  const app = new App(config, pluginManager, serverLogger);
  await app.init();
  app.run();
})();
