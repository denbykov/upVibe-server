import { UUID } from 'crypto';

import { DeviceDTO } from '@src/dtos/deviceDTO';
import { UserDTO } from '@src/dtos/userDTO';

export abstract class iUserDatabase {
  public abstract getUserBySub(sub: string): Promise<UserDTO | null>;
  public abstract insertUser(user: UserDTO): Promise<UserDTO>;
  public abstract insertDevice(device: DeviceDTO): Promise<DeviceDTO>;
  public abstract getDevice(id: UUID): Promise<DeviceDTO | null>;
}
