import { ProcessingError } from '@src/business/processingError';
import { TagWorker } from '@src/business/tagWorker';
import { SourceDTO } from '@src/dto/sourceDTO';
import { TagDTO } from '@src/dto/tagDTO';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';

describe('TagWorker', () => {
  let tagWorker: TagWorker;
  let mockDb: iTagDatabase;
  let mockSourceDb: iSourceDatabase;
  let mockTagPlugin: iTagPlugin;

  beforeEach(() => {
    mockDb = {
      getTagPrimary: jest.fn(),
      doesTagExist: jest.fn(),
      insertTag: jest.fn(),
    } as unknown as iTagDatabase;
    mockSourceDb = {
      getSourcesWithParsingPermission: jest.fn(),
    } as unknown as iSourceDatabase;
    mockTagPlugin = {
      parseTags: jest.fn(),
    } as unknown as iTagPlugin;
    tagWorker = new TagWorker(mockDb, mockSourceDb, mockTagPlugin);
  });

  it('should throw an error if primary tag not found', async () => {
    const spyGetTagPrimary = jest.spyOn(mockDb, 'getTagPrimary');
    spyGetTagPrimary.mockResolvedValue(null);
    await expect(tagWorker.requestTagging(1)).rejects.toThrow(ProcessingError);
    expect(spyGetTagPrimary).toHaveBeenCalledWith(1);
  });

  it('should throw an error if primary tag is not parsed', async () => {
    const spyGetTagPrimary = jest.spyOn(mockDb, 'getTagPrimary');
    const tag = new TagDTO(
      1,
      1,
      false,
      1,
      'CR',
      'A',
      'A',
      'A',
      2000,
      1,
      'PATH'
    );
    spyGetTagPrimary.mockResolvedValue(tag);

    await expect(tagWorker.requestTagging(1)).rejects.toThrow(ProcessingError);
    expect(spyGetTagPrimary).toHaveBeenCalledWith(1);
    expect(mockSourceDb.getSourcesWithParsingPermission).not.toHaveBeenCalled();
  });

  it('should insert tags from all sources', async () => {
    const tag = new TagDTO(
      1,
      1,
      false,
      1,
      'CR',
      'C',
      'A',
      'A',
      2000,
      1,
      'path'
    );
    const sources = [
      new SourceDTO(1, 'source1', true, 'path1'),
      new SourceDTO(2, 'source1', true, 'path2'),
    ];
    const spyGetTagPrimary = jest.spyOn(mockDb, 'getTagPrimary');
    spyGetTagPrimary.mockResolvedValue(tag);
    const spyGetSources = jest.spyOn(
      mockSourceDb,
      'getSourcesWithParsingPermission'
    );
    spyGetSources.mockResolvedValue(sources);
    await expect(tagWorker.requestTagging(1)).rejects.toThrow(ProcessingError);
    expect(spyGetTagPrimary).toHaveBeenCalledWith(1);
  });

  it('should insert tags from all sources', async () => {
    const tag = new TagDTO(1, 1, true, 1, 'CR', 'C', 'A', 'A', 2000, 1, 'path');
    const sources = [
      new SourceDTO(1, 'source1', true, 'path1'),
      new SourceDTO(2, 'source1', true, 'path2'),
    ];
    const spyGetTagPrimary = jest.spyOn(mockDb, 'getTagPrimary');
    spyGetTagPrimary.mockResolvedValue(tag);
    const spyGetSources = jest.spyOn(
      mockSourceDb,
      'getSourcesWithParsingPermission'
    );
    spyGetSources.mockResolvedValue(sources);
    const spyParseTags = jest.spyOn(mockTagPlugin, 'parseTags');
    spyParseTags.mockResolvedValue();
    await expect(tagWorker.requestTagging(1)).rejects.toThrow(ProcessingError);
    expect(spyGetTagPrimary).toHaveBeenCalledWith(1);
  });
});
