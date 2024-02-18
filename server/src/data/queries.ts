const BASE_QUERY_UNION_FILE_TAG =
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
  'tags.status as tag_status, ' +
  'tag_mappings.user_id as mapping_user_id, ' +
  'tag_mappings.id as mapping_tag_id, ' +
  'tag_mappings.file_id as mapping_tag_file_id, ' +
  'tag_mappings.title as mapping_tag_title, ' +
  'tag_mappings.artist as mapping_tag_artist, ' +
  'tag_mappings.album as mapping_tag_album, ' +
  'tag_mappings.picture as mapping_tag_picture, ' +
  'tag_mappings.year as mapping_tag_year, ' +
  'tag_mappings.track_number as mapping_tag_track_number ' +
  'FROM files ' +
  'INNER JOIN file_sources ON files.source_id = file_sources.id ' +
  'LEFT JOIN tags ON files.id = tags.file_id ' +
  'LEFT JOIN tag_sources ON tags.source = tag_sources.id ' +
  'LEFT JOIN tag_mappings ON tags.file_id = tag_mappings.file_id ';

const GET_FILES_BY_USER_ID =
  BASE_QUERY_UNION_FILE_TAG +
  'INNER JOIN user_files ON files.id = user_files.file_id ' +
  'WHERE user_files.user_id =  $1';

const GET_FILE_BY_ID = BASE_QUERY_UNION_FILE_TAG + 'WHERE files.id = $1';

export { GET_FILES_BY_USER_ID, GET_FILE_BY_ID };
