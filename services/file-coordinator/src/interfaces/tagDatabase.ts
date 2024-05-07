import { TagDTO } from '@dtos/tagDTO';

abstract class TagDatabase {
  public abstract getTagByFileId: (id: string) => Promise<TagDTO[]>;
}

export { TagDatabase };
