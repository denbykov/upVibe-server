import { UUID } from 'crypto';

class DeviceDTO {
  public id: UUID;
  public user_id: number | null;
  public name: string;

  constructor(id: UUID, user_id: number | null, name: string) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
  }

  public static fromJSON(json: JSON.JSONObject): DeviceDTO {
    return new DeviceDTO(json.id, json.user_id, json.name);
  }

  public static fromRequestJSON(json: JSON.JSONObject): DeviceDTO {
    return new DeviceDTO(json.deviceId, null, json.deviceName);
  }
}

export { DeviceDTO };
