import { TagMappingPriorityDTO } from '@src/dto/tagMappingPriorityDTO';
import { TagMapping } from '@src/entities/tagMapping';
import { iTagMappingDatabase } from '@src/interfaces/iTagMappingDatabase';

class TagMappingWorker {
  private db: iTagMappingDatabase;

  constructor(db: iTagMappingDatabase) {
    this.db = db;
  }

  public getTagMappingPriority =
    async (): Promise<TagMappingPriorityDTO | null> => {
      return await this.db.getTagMappingPriority();
    };

  public getTagMapping = async (fileId: number): Promise<TagMapping | null> => {
    const tagMappingDTO = await this.db.getTagMapping(fileId);
    return tagMappingDTO ? tagMappingDTO.toEntity() : null;
  };
}

export { TagMappingWorker };
