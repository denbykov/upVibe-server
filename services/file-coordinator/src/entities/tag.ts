export class Tag {
  constructor(
    public id: string,
    public fileId: string,
    public source: string,
    public status: string,
    public title: string | null,
    public artist: string | null,
    public album: string | null,
    public year: number | null,
    public trackNumber: number | null,
  ) {}
}
