import pg from 'pg';

import { MappingFile, MappingFiles } from '@src/dto/mappingFiles';
import { File } from '@src/entities/file';
import { Tag, TagMapping } from '@src/entities/tag';

const mapFile = (data: pg.QueryArrayResult): MappingFile => {
  const file = File.fromJSON(data.rows[0]);
  const tags = data.rows.map((tag) => Tag.fromJSON(tag));
  const fileTags = tags.filter((tag) => {
    return tag.fileId === file.id;
  });
  return {
    id: file.id,
    source: {
      id: file.source.id,
      description: file.source.description,
    },
    status: file.status,
    sourceUrl: file.source.url,
    tags: fileTags.map((tag) => {
      const tagMapping = TagMapping.fromJSON(tag);
      return {
        title: tag.title,
        artist: tag.artist,
        album: tag.album,
        year: tag.year,
        trackNumber: tag.trackNumber,
        pictureId: tagMapping.picture,
      };
    }),
  };
};

const mapFiles = (data: pg.QueryArrayResult): MappingFiles => {
  const removeDuplicates = (arr: File[]) => {
    return arr.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  };

  const files = removeDuplicates(data.rows.map((file) => File.fromJSON(file)));
  const tags = data.rows.map((tag) => Tag.fromJSON(tag));
  const collectedFiles = files.map((file) => {
    const fileTags = tags.filter((tag) => {
      return tag.fileId === file.id;
    });
    return {
      id: file.id,
      source: {
        id: file.source.id,
        description: file.source.description,
      },
      status: file.status,
      sourceUrl: file.source.url,
      tags: fileTags.map((tag) => {
        const tagMapping = TagMapping.fromJSON(tag);
        return {
          title: tag.title,
          artist: tag.artist,
          album: tag.album,
          year: tag.year,
          trackNumber: tag.trackNumber,
          pictureId: tagMapping.picture,
        };
      }),
    };
  });
  if (collectedFiles.length === 0) {
    return null;
  }
  return collectedFiles;
};

export { mapFile, mapFiles };
