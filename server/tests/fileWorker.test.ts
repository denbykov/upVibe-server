/* eslint-disable @typescript-eslint/no-var-requires */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const { parseYoutubeURL } = require("@src/utils/server/parseYoutubeURL");

const { iFileDatabase } = require("@src/interfaces/iFileDatabase");
const { FileWorker } = require("@src/business/fileWorker.business");
const { Config } = require("@src/entities/config");
const { Response } = require("@src/entities/response");

describe("FileWorker", () => {
  let db: typeof iFileDatabase;
  let config: typeof Config;
  let fileWorker: typeof FileWorker;

  beforeEach(() => {
    db = {
      getFiles: jest.fn(),
      getFileSources: jest.fn(),
      getFileSource: jest.fn(),
      startFileDownloading: jest.fn(),
      getFileBySourceUrl: jest.fn(),
      mapUserFile: jest.fn(),
    };
    config = {
      apiRefreshTokenSecret: "secret",
      apiRefreshTokenSecretExpires: "1h",
      rabbitMQDownloadingYouTubeQueue: "downloading-youtube",
      rabbitMQTaggingYouTubeNativeQueue: "tagging-youtube-native",
      rabbitMQDownloadingYouTubeType: "get_file/youtube",
      rabbitMQTaggingYouTubeNativeType: "get_tags/youtube-native",
    };
    fileWorker = new FileWorker(db, config);
  });

  describe("getFiles", () => {
    it("should return a response with files if files are found", async () => {
      const userId = 1;
      const files = {
        files: [
          {
            id: 0,
            source: {
              id: 1,
              name: "youtube",
            },
            status: "P",
            statusDescription: "Pending",
            sourceUrl: "https://youtu.be/3MOTsSLWank",
          },
          {
            id: 1,
            source: {
              id: 2,
              name: "youtube",
            },
            status: "P",
            statusDescription: "Pending",
            sourceUrl: "https://youtu.be/3MOTsSLWbnk",
          },
        ],
        code: 0,
      };
      db.getFiles.mockResolvedValue(files);
      const response: typeof Response = await fileWorker.getFiles(userId);
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload.files).toEqual(files);
    });

    it("should return a response with an error message if no files are found", async () => {
      const userId = 1;
      db.getFiles.mockResolvedValue(null);
      const response = await fileWorker.getFiles(userId);
      expect(response.httpCode).toBe(Response.Code.NotFound);
      expect(response.payload).toBe("No files found");
    });
  });

  describe("getFileSources", () => {
    it("should return a response with file sources if sources are found", async () => {
      const sources = [
        {
          id: 1,
          source: "youtube",
        },
        {
          id: 2,
          source: "youtube",
        },
      ];
      db.getFileSources.mockResolvedValue(sources);
      const response = await fileWorker.getFileSources();
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload.sources).toEqual(sources);
    });

    it("should return a response with an error message if no sources are found", async () => {
      db.getFileSources.mockResolvedValue(null);
      const response = await fileWorker.getFileSources();
      expect(response.httpCode).toBe(Response.Code.NotFound);
      expect(response.payload).toBe("No sources found");
    });
  });

  describe("getFileSourcePicture", () => {
    it("should return a response with a picture if the picture is found", async () => {
      const sourceId = 1;
      const imagePath = "path/to/picture";
      db.getFileSource.mockResolvedValue({ imagePath });
      const response = await fileWorker.getFileSourcePicture(sourceId);
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload).toBe(imagePath);
    });

    it("should return a response with an error message if the picture is not found", async () => {
      const sourceId = 1;
      db.getFileSource.mockResolvedValue(null);
      const response = await fileWorker.getFileSourcePicture(sourceId);
      expect(response.httpCode).toBe(Response.Code.NotFound);
      expect(response.payload).toBe("No picture found");
    });
  });

  describe("startFileDownloading", () => {
    it("should return a response with a success message if the URL is valid", async () => {
      const userId = 1;
      const sourceUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      db.startFileDownloading.mockResolvedValue(null);
      const response = await fileWorker.startFileDownloading(userId, sourceUrl);
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload).toBe(
        `Start downloading https://youtu.be/${parseYoutubeURL(sourceUrl)}`,
      );
    });

    it("should return a response with a success message if the URL is a YouTube video and post message in RabbitMQ", async () => {
      const userId = 1;
      const sourceUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      db.startFileDownloading.mockResolvedValue(null);
      const response = await fileWorker.startFileDownloading(userId, sourceUrl);
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload).toBe(
        `Start downloading https://youtu.be/${parseYoutubeURL(sourceUrl)}`,
      );
      expect(db.startFileDownloading).toHaveBeenCalledWith(
        config,
        userId,
        `https://youtu.be/${parseYoutubeURL(sourceUrl)}`,
        config.rabbitMQDownloadingYouTubeQueue,
        config.rabbitMQTaggingYouTubeNativeQueue,
        config.rabbitMQDownloadingYouTubeType,
        config.rabbitMQTaggingYouTubeNativeType,
      );
    });

    it("should return a response with an error message if the URL is invalid", async () => {
      const userId = 1;
      const sourceUrl = "invalid-url";
      db.getFileBySourceUrl.mockResolvedValue(null);
      const response = await fileWorker.startFileDownloading(userId, sourceUrl);
      expect(response.httpCode).toBe(Response.Code.InternalServerError);
      expect(response.payload).toBe("Server error");
    });

    it("should return a response with a success message if the file already exists", async () => {
      const userId = 1;
      const sourceUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const fileId = 1;
      db.getFileBySourceUrl.mockResolvedValue(fileId);
      db.startFileDownloading.mockImplementation(() => {
        throw new Error("File already exists");
      });
      db.mapUserFile.mockResolvedValue(false);
      const response = await fileWorker.startFileDownloading(userId, sourceUrl);
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload).toBe("File already exists");
    });

    it("should return a response with a success message if the file was added successfully", async () => {
      const userId = 1;
      const sourceUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const fileId = 1;
      db.getFileBySourceUrl.mockResolvedValue(fileId);
      db.startFileDownloading.mockImplementation(() => {
        throw new Error("File already exists");
      });
      db.mapUserFile.mockResolvedValue(true);
      const response = await fileWorker.startFileDownloading(userId, sourceUrl);
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload).toBe("The file was successfully added");
    });
  });
});
