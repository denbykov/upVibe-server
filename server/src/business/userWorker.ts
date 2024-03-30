import { UserDTO } from '@src/dto/userDTO';
import { Device } from '@src/entities/device';
import { User } from '@src/entities/user';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { iUserInfoAgent } from '@src/interfaces/iUserInfoAgent';
import { dataLogger } from '@src/utils/server/logger';

import { ProcessingError } from './processingError';

export class UserWorker {
  private db: iUserDatabase;
  private userInfoAgent: iUserInfoAgent;

  constructor(db: iUserDatabase, userInfoAgent: iUserInfoAgent) {
    this.db = db;
    this.userInfoAgent = userInfoAgent;
    dataLogger.trace('UserWorker initialized');
  }

  public getUser = async (sub: string): Promise<User | null> => {
    dataLogger.trace('UserWorker.getUser()');
    const user = await this.db.getUserBySub(sub);
    return user;
  };

  public handleAuthorization = async (
    payload: JSON.JSONObject,
    permissions: Array<string>
  ): Promise<User> => {
    dataLogger.trace('UserWorker.handleAuthorization()');

    for (const permission of permissions) {
      if (!payload.permissions.includes(permission)) {
        throw new ProcessingError(
          `User does not have permission: ${permission}`
        );
      }
    }
    const dbUser = await this.getUser(payload.sub);
    if (dbUser) {
      return dbUser;
    } else {
      throw new ProcessingError('User not found');
    }
  };

  public registerUser = async (rawToken: string): Promise<User> => {
    dataLogger.trace('UserWorker.registerUser()');
    const user = await this.userInfoAgent.getUserInfoByToken(rawToken);
    return await this.db.insertUser(user!);
  };

  public registerUserDevice = async (
    user: UserDTO,
    name: string
  ): Promise<Device> => {
    dataLogger.trace('UserWorker.registerUserDevice()');
    return await this.db.insertUserDevice(user, name);
  };

  public handleRegistration = async (
    rawToken: string,
    payload: JSON.JSONObject,
    deviceName: string
  ): Promise<Device> => {
    dataLogger.trace('UserWorker.handleRegistration()');
    let dbUser = await this.getUser(payload.sub);
    if (!dbUser) {
      dbUser = await this.registerUser(rawToken);
      return await this.registerUserDevice(dbUser, deviceName);
    }
    const dbDevice = await this.db.getDeviceByUser(dbUser);
    if (!dbDevice) {
      return await this.registerUserDevice(dbUser, deviceName);
    }
    return dbDevice;
  };
}
