import { getLogger, configure } from 'log4js';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('config/log4j.properties', 'utf8'));
configure(config);

export const serverLogger = getLogger('[SERVER]');
export const dataLogger = getLogger('[DATA]');
export const businessLogger = getLogger('[Business]');
export const presentationLogger = getLogger('presentation');
