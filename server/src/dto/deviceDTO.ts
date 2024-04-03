import { Device } from '@src/entities/device';

class DeviceDTO {
  public id: number;
  public user_id: number;
  public name: string;

  constructor(id: number, user_id: number, name: string) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
  }

  public static fromJSON(json: JSON.JSONObject): DeviceDTO {
    return new DeviceDTO(json.id, json.user_id, json.name);
  }

  public static toEntity(device: DeviceDTO): Device {
    return new Device(device.id, device.user_id, device.name);
  }
}

export { DeviceDTO };
