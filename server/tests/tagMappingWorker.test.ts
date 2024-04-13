import { ProcessingError } from '@src/business/processingError';
import { TagMappingWorker } from '@src/business/tagMappingWorker';
import { TagMappingDTO } from '@src/dtos/tagMappingDTO';
import { TagMapping } from '@src/entities/tagMapping';
import { iTagMappingDatabase } from '@src/interfaces/iTagMappingDatabase';
import { TagMappingMapper } from '@src/mappers/tagMappingMapper';

describe('TagMappingWorker', () => {
  let tagMappingWorker: TagMappingWorker;
  let mockDb: iTagMappingDatabase;

  beforeEach(() => {
    mockDb = {
      updateTagMapping: jest.fn(),
    } as unknown as iTagMappingDatabase;
    tagMappingWorker = new TagMappingWorker(mockDb);
  });

  it('should update a tag mapping', async () => {
    const tagMapping = new TagMapping('1', '1', '1', '1', '1', '1');
    const tagMappingUpdateDTO = new TagMappingDTO(
      '2',
      '2',
      '2',
      '2',
      '2',
      '2',
      '2',
      '2',
      '2'
    );
    const fileId = '1';
    jest
      .spyOn(mockDb, 'updateTagMapping')
      .mockResolvedValue(tagMappingUpdateDTO);
    const result = await tagMappingWorker.updateTagMapping(tagMapping, fileId);
    expect(result).toEqual(
      new TagMappingMapper().toEntity(tagMappingUpdateDTO)
    );
  });

  it('should throw an error if updating a tag mapping fails', async () => {
    const tagMapping = new TagMapping('1', '1', '1', '1', '1', '1');
    const fileId = '1';

    jest.spyOn(mockDb, 'updateTagMapping').mockRejectedValue(new Error());

    await expect(
      tagMappingWorker.updateTagMapping(tagMapping, fileId)
    ).rejects.toThrow(ProcessingError);
  });
});
