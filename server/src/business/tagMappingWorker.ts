import { TagMapping } from '@src/entities/tagMapping';
import { TagMappingPriority } from '@src/entities/tagMappingPriority';
import { iTagMappingDatabase } from '@src/interfaces/iTagMappingDatabase';

class TagMappingWorker {
  private db: iTagMappingDatabase;

  constructor(db: iTagMappingDatabase) {
    this.db = db;
  }

  public getTagMappingPriority = async (
    userId: number
  ): Promise<TagMappingPriority> => {
    const tagMappingDTO = await this.db.getTagMappingPriority(userId);
    return tagMappingDTO.toEntity();
  };

  public getTagMapping = async (fileId: number): Promise<TagMapping | null> => {
    const tagMappingDTO = await this.db.getTagMapping(fileId);
    return tagMappingDTO ? tagMappingDTO.toEntity() : null;
  };
}

export { TagMappingWorker };
