import { DeviceDTO } from '@src/dto/deviceDTO';
import { User } from '@src/entities/user';
import { iUserDatabase } from '@src/interfaces/iUserDatabase';
import { iUserInfoAgent } from '@src/interfaces/iUserInfoAgent';

import { ProcessingError } from './processingError';

export class UserWorker {
  private db: iUserDatabase;
  private userInfoAgent: iUserInfoAgent;

  constructor(db: iUserDatabase, userInfoAgent: iUserInfoAgent) {
    this.db = db;
    this.userInfoAgent = userInfoAgent;
  }

  public getUser = async (sub: string): Promise<User | null> => {
    const user = await this.db.getUserBySub(sub);
    return user;
  };

  public handleAuthorization = async (
    payload: JSON.JSONObject,
    permissions: Array<string>
  ): Promise<User> => {
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
    const user = await this.userInfoAgent.getUserInfoByToken(rawToken);
    return await this.db.insertUser(user!);
  };

  public registerDevice = async (device: DeviceDTO): Promise<DeviceDTO> => {
    return await this.db.insertDevice(device);
  };

  public handleRegistration = async (
    rawToken: string,
    userSub: string,
    device: DeviceDTO
  ): Promise<void> => {
    let user = await this.getUser(userSub);
    if (!user) {
      user = await this.registerUser(rawToken);
    }

    if (await this.db.getDevice(device.id)) {
      throw new ProcessingError('Device is already registered');
    }

    device.user_id = user.id;
    await this.registerDevice(device);
  };
}
