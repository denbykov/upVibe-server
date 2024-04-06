import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { FileWorker } from '@src/business/fileWorker';
import { FileDTO } from '@src/dto/fileDTO';
import { File, ShortTags } from '@src/entities/file';
import { Source } from '@src/entities/source';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { iFilePlugin } from '@src/interfaces/iFilePlugin';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { iTagPlugin } from '@src/interfaces/iTagPlugin';

describe('FileWorker', () => {
  let fileWorker: FileWorker;
  let mockDb: iFileDatabase;
  let mockSourceDb: iSourceDatabase;
  let mockTagDb: iTagDatabase;
  let mockFilePlugin: iFilePlugin;
  let mockTagPlugin: iTagPlugin;

  beforeEach(() => {
    mockDb = jest.fn() as unknown as iFileDatabase;
    mockTagDb = jest.fn() as unknown as iTagDatabase;
    mockFilePlugin = jest.fn() as unknown as iFilePlugin;
    mockTagPlugin = jest.fn() as unknown as iTagPlugin;
    fileWorker = new FileWorker(
      mockDb,
      mockSourceDb,
      mockTagDb,
      mockFilePlugin,
      mockTagPlugin
    );
  });

  it('should download a file', async () => {
    const mockUser = new User(0, 'test', 'test');
    const mockSourceUrl = 'http://example.com';
    const mockFile = new File(
      0,
      new Source(0, 'test'),
      'test',
      'test',
      new ShortTags('test', 'test', 'test', 1, 1, 1)
    );
    jest.spyOn(fileWorker, 'downloadFile').mockResolvedValue(mockFile);
    const result = await fileWorker.downloadFile(mockSourceUrl, mockUser);
    expect(result).toBe(mockFile);
  });

  it('should request file processing', async () => {
    const mockFileDTO = new FileDTO(1, 'test', 1, 'CR', 'test');
    const mockUserId = 1;
    jest
      .spyOn(fileWorker, 'requestFileProcessing')
      .mockResolvedValue(undefined);
    await fileWorker.requestFileProcessing(mockFileDTO, mockUserId);
    expect(fileWorker.requestFileProcessing).toHaveBeenCalledWith(
      mockFileDTO,
      mockUserId
    );
  });

  it('should get tagged files by user', async () => {
    const mockUser = new User(0, 'test', 'test');
    const mockFiles = [
      new File(
        0,
        new Source(0, 'test'),
        'test',
        'test',
        new ShortTags('test', 'test', 'test', 1, 1, 1)
      ),
      new File(
        0,
        new Source(0, 'test'),
        'test',
        'test',
        new ShortTags('test', 'test', 'test', 1, 1, 1)
      ),
    ];
    jest.spyOn(fileWorker, 'getTaggedFilesByUser').mockResolvedValue(mockFiles);
    const result = await fileWorker.getTaggedFilesByUser(mockUser);
    expect(result).toBe(mockFiles);
  });

  it('should get tagged file', async () => {
    const mockId = 1;
    const mockUser = new User(0, 'test', 'test');
    const mockFile = new File(
      0,
      new Source(0, 'test'),
      'test',
      'test',
      new ShortTags('test', 'test', 'test', 1, 1, 1)
    );
    jest.spyOn(fileWorker, 'getTaggedFile').mockResolvedValue(mockFile);
    const result = await fileWorker.getTaggedFile(mockId, mockUser);
    expect(result).toBe(mockFile);
  });
});
