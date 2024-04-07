export class Tag {
  constructor(
    public id: number,
    public fileId: number,
    public source: number,
    public status: string,
    public title: string | null,
    public artist: string | null,
    public album: string | null,
    public year: number | null,
    public trackNumber: number | null
  ) {}
}
