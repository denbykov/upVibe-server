import fs from 'fs';
import { configure, getLogger } from 'log4js';

const config = JSON.parse(fs.readFileSync('config/log4j.properties', 'utf8'));
configure(config);

const serverLogger = getLogger('[SERVER]');
const dataLogger = getLogger('[DATA]');
const businessLogger = getLogger('[BUSINESS]');
const presentationLogger = getLogger('[PRESENTATION]');

export { serverLogger, dataLogger, businessLogger, presentationLogger };
