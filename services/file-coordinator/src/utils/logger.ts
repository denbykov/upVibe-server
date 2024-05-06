import fs from 'fs';
import { configure, getLogger } from 'log4js';

configure(JSON.parse(fs.readFileSync('configs/log4j.properties', 'utf8')));

const appLogger = getLogger('[APP]');
const dataLogger = getLogger('[DATA]');
const businessLogger = getLogger('[Business]');
const presentationLogger = getLogger('presentation');

export { appLogger, dataLogger, businessLogger, presentationLogger };
