import { DeviceDTO } from '@src/dto/deviceDTO';
import { UserDTO } from '@src/dto/userDTO';

export abstract class iUserDatabase {
  public abstract getUserBySub(sub: string): Promise<UserDTO | null>;
  public abstract getDeviceByUser(user: UserDTO): Promise<DeviceDTO | null>;
  public abstract insertUser(user: UserDTO): Promise<UserDTO>;
  public abstract insertUserDevice(
    user: UserDTO,
    deviceName: string
  ): Promise<DeviceDTO>;
}
