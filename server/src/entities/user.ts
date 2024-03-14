export class User {
  public id: number;
  public sub: string;
  public name: string;

  constructor(id: number, sub: string, name: string) {
    this.id = id;
    this.sub = sub;
    this.name = name;
  }
}
