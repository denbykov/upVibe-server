export class User {
  public id: string;
  public sub: string;
  public name: string;

  constructor(id: string, sub: string, name: string) {
    this.id = id;
    this.sub = sub;
    this.name = name;
  }
}
