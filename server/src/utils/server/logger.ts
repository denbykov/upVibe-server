import { getLogger, configure } from 'log4js';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('config/log4j.properties', 'utf8'));
configure(config);

export const serverLogger = getLogger('server');
export const dataLogger = getLogger('data');
export const businessLogger = getLogger('business');
export const presentationLogger = getLogger('presentation');
