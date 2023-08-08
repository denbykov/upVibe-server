/* eslint-disable @typescript-eslint/no-var-requires */
import { expect, test } from '@jest/globals';
import dotenv from 'dotenv';

const { Config } = require('@src/entities/config');
const { AuthWorker } = require('@src/business/authWorker');
const { AuthorizationRepository } = require('@src/data');

const env = dotenv.config({ path: 'config/.env' }).parsed || {};
const config = new Config(env, {});

const authWorker = new AuthWorker(new AuthorizationRepository(config), config);

test('verifyAccessToken', async () => {
  const token = authWorker.generateAccessToken(1);
  expect(authWorker.verifyAccessToken(token)).toBe(true);
});

test('verifyRefreshToken', async () => {
  const token = authWorker.generateRefreshToken(1);
  expect(authWorker.verifyRefreshToken(token)).toBe(true);
});

test('generateAccessToken', async () => {
  const token = authWorker.generateAccessToken(1);
  expect(token).toBeDefined();
});

test('generateRefreshToken', async () => {
  const token = authWorker.generateRefreshToken(1);
  expect(token).toBeDefined();
});
