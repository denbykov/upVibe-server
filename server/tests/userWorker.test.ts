import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { randomUUID } from 'crypto';

import { ProcessingError } from '@src/business/processingError';
import { UserWorker } from '@src/business/userWorker';
import { DeviceDTO } from '@src/dto/deviceDTO';
import { UserDTO } from '@src/dto/userDTO';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { iUserInfoAgent } from '@src/interfaces/iUserInfoAgent';

describe('UserWorker', () => {
  let mockUserDatabase: iUserDatabase;
  let mockUserInfoAgent: iUserInfoAgent;
  let userWorker: UserWorker;

  beforeEach(() => {
    mockUserDatabase = {
      getUserBySub: jest.fn(),
      insertUser: jest.fn(),
      insertDevice: jest.fn(),
      getDevice: jest.fn(),
    } as unknown as iUserDatabase;

    mockUserInfoAgent = {
      getUserInfoByToken: jest.fn(),
    } as unknown as iUserInfoAgent;

    userWorker = new UserWorker(mockUserDatabase, mockUserInfoAgent);
  });

  describe('getUser', () => {
    it('should return the user from the database', async () => {
      const user = new UserDTO(1, 'test', 'test');
      const spyGetUserBySub = jest
        .spyOn(mockUserDatabase, 'getUserBySub')
        .mockResolvedValue(user);
      const result = await userWorker.getUser(user.sub);
      expect(spyGetUserBySub).toHaveBeenCalledWith(user.sub);
      expect(result).toBe(user);
    });
    it('should return null if the user is not found', async () => {
      const spyGetUserBySub = jest
        .spyOn(mockUserDatabase, 'getUserBySub')
        .mockResolvedValue(null);
      const result = await userWorker.getUser('test');
      expect(spyGetUserBySub).toHaveBeenCalledWith('test');
      expect(result).toBe(null);
    });
  });
  describe('handleAuthorization', () => {
    it('should throw an error if the user does not have the required permission', async () => {
      const payload = {
        permissions: ['test'],
        sub: 'test',
      };
      const permissions = ['test2'];
      await expect(
        userWorker.handleAuthorization(payload, permissions)
      ).rejects.toThrow(
        new ProcessingError('User does not have permission: test2')
      );
    });
    it('should return the user if the user has the required permission', async () => {
      const payload = {
        permissions: ['test'],
        sub: 'test',
      };
      const permissions = ['test'];
      const user = new UserDTO(1, 'test', 'test');
      const spyGetUser = jest
        .spyOn(userWorker, 'getUser')
        .mockResolvedValue(user);
      const result = await userWorker.handleAuthorization(payload, permissions);
      expect(spyGetUser).toHaveBeenCalledWith(payload.sub);
      expect(result).toBe(user);
    });
    it('should throw an error if the user is not found', async () => {
      const payload = {
        permissions: ['test'],
        sub: 'test',
      };
      const permissions = ['test'];
      const spyGetUser = jest
        .spyOn(userWorker, 'getUser')
        .mockResolvedValue(null);
      await expect(
        userWorker.handleAuthorization(payload, permissions)
      ).rejects.toThrow(new ProcessingError('User not found'));
      expect(spyGetUser).toHaveBeenCalledWith(payload.sub);
      expect(spyGetUser).toHaveBeenCalledTimes(1);
    });
  });
  describe('registerUser', () => {
    it('should return the registered user', async () => {
      const rawToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNTE2MjM5MDIyfQ';
      const user = new UserDTO(1, 'test', 'test');
      const spyGetUserInfoByToken = jest
        .spyOn(mockUserInfoAgent, 'getUserInfoByToken')
        .mockResolvedValue(user);
      const spyInsertUser = jest
        .spyOn(mockUserDatabase, 'insertUser')
        .mockResolvedValue(user);
      const result = await userWorker.registerUser(rawToken);
      expect(spyGetUserInfoByToken).toHaveBeenCalledWith(rawToken);
      expect(spyInsertUser).toHaveBeenCalledWith(user);
      expect(result).toBe(user);
    });
  });
  describe('registerDevice', () => {
    it('should return the registered device', async () => {
      const device = new DeviceDTO(randomUUID(), 1, 'test');
      const spyInsertDevice = jest
        .spyOn(mockUserDatabase, 'insertDevice')
        .mockResolvedValue(device);
      const result = await userWorker.registerDevice(device);
      expect(spyInsertDevice).toHaveBeenCalledWith(device);
      expect(result).toBe(device);
    });
  });
  describe('handleRegistration', () => {
    it('should register the user and device', async () => {
      const rawToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNTE2MjM5MDIyfQ';
      const userSub = 'test';
      const device = new DeviceDTO(randomUUID(), 1, 'test');
      const user = new UserDTO(1, 'test', 'test');
      const spyGetUser = jest
        .spyOn(userWorker, 'getUser')
        .mockResolvedValue(null);
      const spyRegisterUser = jest
        .spyOn(userWorker, 'registerUser')
        .mockResolvedValue(user);
      const spyGetDevice = jest
        .spyOn(mockUserDatabase, 'getDevice')
        .mockResolvedValue(null);
      const spyRegisterDevice = jest
        .spyOn(userWorker, 'registerDevice')
        .mockResolvedValue(device);
      await userWorker.handleRegistration(rawToken, userSub, device);
      expect(spyGetUser).toHaveBeenCalledWith(userSub);
      expect(spyRegisterUser).toHaveBeenCalledWith(rawToken);
      expect(spyGetDevice).toHaveBeenCalledWith(device.id);
      expect(spyRegisterDevice).toHaveBeenCalledWith(device);
    });
    it('should throw an error if the device is already registered', async () => {
      const rawToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNTE2MjM5MDIyfQ';
      const userSub = 'test';
      const device = new DeviceDTO(randomUUID(), 1, 'test');
      const user = new UserDTO(1, 'test', 'test');
      const spyGetUser = jest
        .spyOn(userWorker, 'getUser')
        .mockResolvedValue(user);
      const spyGetDevice = jest
        .spyOn(mockUserDatabase, 'getDevice')
        .mockResolvedValue(device);
      await expect(
        userWorker.handleRegistration(rawToken, userSub, device)
      ).rejects.toThrow(new ProcessingError('Device is already registered'));
      expect(spyGetUser).toHaveBeenCalledWith(userSub);
      expect(spyGetDevice).toHaveBeenCalledWith(device.id);
    });
  });
});
