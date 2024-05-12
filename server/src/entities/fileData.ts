export class FileData {
  public name: string;
  public data: Buffer;

  constructor(name: string, data: Buffer) {
    this.name = name;
    this.data = data;
  }
}
