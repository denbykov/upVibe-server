/* eslint-disable @typescript-eslint/no-var-requires */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const { iTagDatabase } = require('@src/interfaces/iTagDatabase');
const { TagWorker } = require('@src/business/tagWorker.business');
const { Config } = require('@src/entities/config');
const { Response } = require('@src/entities/response');

describe('TagWorker', () => {
  let tagWorker: typeof TagWorker;
  let db: typeof iTagDatabase;
  let config: typeof Config;

  beforeEach(() => {
    db = {
      getFileTags: jest.fn(),
      getFilePictureTag: jest.fn(),
      getTagSources: jest.fn(),
      getTagSourcePicture: jest.fn(),
    };
    config = {};
    tagWorker = new TagWorker(db, config);
  });

  describe('getFileTags', () => {
    it('should return a Response with tags if they exist', async () => {
      const fileId = 1;
      const tags = {
        id: 22,
        fileId: 26,
        title: 'CHMCL SØUP - DARKSIDE',
        artist: 'CHMCL SØUP',
        album: 'DARKSIDE (Slowed + Reverb)',
        picturePath:
          'https://i.ytimg.com/vi/jjCpZrxvYUU/hq720.jpg?sqp=-oaymwEXCNUGEOADIAQqCwjVARCqCBh4INgESFo&rs=AOn4CLDDcQUuD27BiNd4eM9uyj0SGEPrjg',
        year: '2023-08-18T21:00:00.000Z',
        trackNumber: null,
        sourceType: {
          id: 1,
          description: 'youtube-native',
        },
        status: {
          id: 'C',
          description: 'Completed',
        },
      };
      db.getFileTags.mockResolvedValue(tags);

      const response = await tagWorker.getFileTags(fileId);

      expect(db.getFileTags).toHaveBeenCalledWith(fileId);
      expect(response).toEqual(new Response(Response.Code.Ok, { tags }));
    });

    it('should return a NotFound response if no tags exist', async () => {
      const fileId = 1;
      db.getFileTags.mockResolvedValue(null);

      const response = await tagWorker.getFileTags(fileId);

      expect(db.getFileTags).toHaveBeenCalledWith(fileId);
      expect(response).toEqual(
        new Response(Response.Code.NotFound, 'No tags found', 1)
      );
    });
  });

  describe('getFilePictureTag', () => {
    it('should return a Response with the picture path if it exists', async () => {
      const tagId = 1;
      const picturePath = '/path/to/picture';
      db.getFilePictureTag.mockResolvedValue(picturePath);

      const response = await tagWorker.getFilePictureTag(tagId);

      expect(db.getFilePictureTag).toHaveBeenCalledWith(tagId);
      expect(response).toEqual(new Response(Response.Code.Ok, picturePath));
    });

    it('should return a NotFound response if no picture exists', async () => {
      const tagId = 1;
      db.getFilePictureTag.mockResolvedValue(null);

      const response = await tagWorker.getFilePictureTag(tagId);

      expect(db.getFilePictureTag).toHaveBeenCalledWith(tagId);
      expect(response).toEqual(
        new Response(Response.Code.NotFound, 'No picture found', 1)
      );
    });
  });

  describe('getTagSources', () => {
    it('should return a Response with sources if they exist', async () => {
      const sources = ['source1', 'source2'];
      db.getTagSources.mockResolvedValue(sources);

      const response = await tagWorker.getTagSources();

      expect(db.getTagSources).toHaveBeenCalled();
      expect(response).toEqual(new Response(Response.Code.Ok, { sources }));
    });

    it('should return a NotFound response if no sources exist', async () => {
      db.getTagSources.mockResolvedValue(null);

      const response = await tagWorker.getTagSources();

      expect(db.getTagSources).toHaveBeenCalled();
      expect(response).toEqual(
        new Response(Response.Code.NotFound, 'No sources found', 1)
      );
    });
  });

  describe('getTagSourcePicture', () => {
    it('should return a Response with the picture path if it exists', async () => {
      const sourceId = 1;
      const picturePath = '/path/to/picture';
      db.getTagSourcePicture.mockResolvedValue(picturePath);

      const response = await tagWorker.getTagSourcePicture(sourceId);

      expect(db.getTagSourcePicture).toHaveBeenCalledWith(sourceId);
      expect(response).toEqual(new Response(Response.Code.Ok, picturePath));
    });

    it('should return a NotFound response if no picture exists', async () => {
      const sourceId = 1;
      db.getTagSourcePicture.mockResolvedValue(null);

      const response = await tagWorker.getTagSourcePicture(sourceId);

      expect(db.getTagSourcePicture).toHaveBeenCalledWith(sourceId);
      expect(response).toEqual(
        new Response(Response.Code.NotFound, 'No picture found', 1)
      );
    });
  });
});
