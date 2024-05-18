import fs from 'fs';
import { configure, getLogger } from 'log4js';

configure(JSON.parse(fs.readFileSync('config/log4j.properties', 'utf8')));

const appLogger = getLogger('[APP]');
const amqpLogger = getLogger('[AMQP]');
const dataLogger = getLogger('[DATA]');
const businessLogger = getLogger('[BUSINESS]');
const controllerLogger = getLogger('[CONTROLLER]');

export { appLogger, dataLogger, businessLogger, controllerLogger, amqpLogger };
