import { SourceWorker } from '@src/business/sourceWorker';
import { SourceDTO } from '@src/dto/sourceDTO';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';

describe('sourceWorker', () => {
  let dbMock: iSourceDatabase;
  let sourceWorker: SourceWorker;

  beforeEach(() => {
    dbMock = {
      getSource: jest.fn(),
      getSources: jest.fn(),
      getSourcesWithParsingPermission: jest.fn(),
    } as unknown as iSourceDatabase;
    sourceWorker = new SourceWorker(dbMock);
  });

  it('should call getSources', async () => {
    const sources = [
      new SourceDTO('1', 'testSourceId', true, 'testSourceName'),
    ];
    const expectedSources = [
      new SourceDTO('1', 'testSourceId', true, 'testSourceName').toEntity(),
    ];
    const spyGetSources = jest
      .spyOn(dbMock, 'getSources')
      .mockResolvedValue(sources);
    const result = await sourceWorker.getSources();
    expect(spyGetSources).toHaveBeenCalled();
    expect(result).toEqual(expectedSources);
  });

  it('should call getSourceLogo', async () => {
    const sourceId = '1';
    const source = new SourceDTO('1', 'testSourceId', true, 'testSourceName');
    const spyGetSource = jest
      .spyOn(dbMock, 'getSource')
      .mockResolvedValue(source);
    const result = await sourceWorker.getSourceLogo(sourceId);
    expect(spyGetSource).toHaveBeenCalledWith(sourceId);
    expect(result).toEqual(source.logoPath);
  });
});
