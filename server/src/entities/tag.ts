import { TagDTO } from '@src/dto/tagDTO';

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
    public trackNumber: number | null,
    public pictureId: string | null
  ) {}

  public static fromDTO = (dto: TagDTO): Tag => {
    return new Tag(
      dto.id,
      dto.fileId,
      dto.source,
      dto.status,
      dto.title,
      dto.artist,
      dto.album,
      dto.year,
      dto.trackNumber,
      dto.picturePath
    );
  };
}
