class Device {
  public id: number;
  public user_id: number;
  public name: string;

  constructor(id: number, user_id: number, name: string) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
  }
}

export { Device };
