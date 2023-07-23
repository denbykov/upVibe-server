import {expect, jest, test} from '@jest/globals';
import {AuthWorker} from '../../../src/business/authWorker';
import {Database} from '../../../src/data/database';
import { Constants } from '../../../src/entities/constants';
import dotenv from 'dotenv';

const env = dotenv.config({path: 'config/.env'}).parsed || {};

const config = new Constants(env).init();

const authWorker = new AuthWorker(new Database(config), config);

it('should verify a expired token', async () => {
    const token = '31313';
    const result = await authWorker.verifyExpiredToken(token, "access");
    expect(result).toBe(true);
});