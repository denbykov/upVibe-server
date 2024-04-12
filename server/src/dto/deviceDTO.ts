import { UUID } from 'crypto';

class DeviceDTO {
  public id: UUID;
  public user_id: string;
  public name: string;

  constructor(id: UUID, user_id: string, name: string) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
  }

  public static fromJSON(json: JSON.JSONObject): DeviceDTO {
    return new DeviceDTO(json.id, `${json.user_id}`, json.name);
  }

  public static fromRequestJSON(json: JSON.JSONObject): DeviceDTO {
    return new DeviceDTO(json.deviceId, json.userId, json.deviceName);
  }
}

export { DeviceDTO };
