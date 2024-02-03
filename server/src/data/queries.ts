const GET_BASE_QUERY =
  'SELECT files.id as file_id, ' +
  'files.path as file_path, ' +
  'file_sources.id as file_sources_id, ' +
  'files.source_url as file_sources_url, ' +
  'file_sources.description as file_sources_description, ' +
  'file_sources.logo_path as file_sources_logo_path, ' +
  'files.status as file_status, ' +
  'tags.id as tag_id, ' +
  'tags.file_id as tag_file_id, ' +
  'tags.title as tag_title, ' +
  'tags.artist as tag_artist, ' +
  'tags.album as tag_album, ' +
  'tags.picture_path as tag_picture_path, ' +
  'tags.year as tag_year, ' +
  'tags.track_number as tag_track_number, ' +
  'tag_sources.id as tag_sources_id, ' +
  'tag_sources.description as tag_sources_description, ' +
  'tag_sources.logo_path as tag_sources_logo_path, ' +
  'tags.status as tag_status ' +
  'FROM files ' +
  'INNER JOIN user_files ON files.id = user_files.file_id ' +
  'INNER JOIN file_sources ON files.source_id = file_sources.id ' +
  'INNER JOIN tags ON files.id = tags.file_id ' +
  'INNER JOIN tag_sources ON tags.source = tag_sources.id ' +
  'INNER JOIN tag_statuses ON tags.status = tag_statuses.status ';

const GET_FILES_BY_USER = GET_BASE_QUERY + 'WHERE user_files.user_id = $1';

const GET_FILE_BY_ID = GET_BASE_QUERY + 'WHERE files.id = $1';

const GET_FILE_BY_URL =
  'WITH file AS (SELECT * FROM files WHERE source_url = $1) ' +
  'SELECT file.id as file_id, ' +
  'file.path as file_path, ' +
  'file.source_url as file_source_url, ' +
  'file.source_id as file_source_id, ' +
  'file.status as file_status, ' +
  'file_sources.id as file_sources_id, ' +
  'file_sources.description as file_sources_description, ' +
  'file_sources.logo_path as file_sources_logo_path ' +
  'FROM file ' +
  'INNER JOIN file_sources ON file.source_id = file_sources.id';

const GET_FILE_SOURCE =
  'SELECT id as file_sources_id, ' +
  'description as file_sources_description, ' +
  'logo_path as file_sources_logo_path ' +
  'FROM file_sources WHERE description = $1';

const GET_FILE_SOURCES =
  'SELECT id as file_sources_id, ' +
  'description as file_sources_description, ' +
  'logo_path as file_sources_logo_path ' +
  'FROM file_sources';

const GET_PICTURE_BY_SOURCE_ID =
  'SELECT logo_path as file_sources_logo_path ' +
  'FROM file_sources WHERE id = $1';

const INSERT_FILE_RECORD =
  'INSERT INTO files (path, source_url, source_id, status) ' +
  'VALUES ($1, $2, $3, $4) RETURNING ' +
  'id as file_id, ' +
  'path as file_path, ' +
  'source_url as file_source_url, ' +
  'source_id as file_source_id, ' +
  'status as file_status';

const INSERT_USER_FILE_RECORD =
  'INSERT INTO user_files (user_id, file_id) VALUES ($1, $2)';

export {
  GET_FILES_BY_USER,
  GET_FILE_BY_ID,
  GET_FILE_BY_URL,
  GET_FILE_SOURCE,
  GET_FILE_SOURCES,
  INSERT_FILE_RECORD,
  INSERT_USER_FILE_RECORD,
  GET_PICTURE_BY_SOURCE_ID,
};
