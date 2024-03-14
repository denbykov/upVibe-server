INSERT INTO
files (path, source_url, source_id, status)
VALUES ($1, $2, $3, $4)
RETURNING
id as file_id,
path as file_path,
source_url as file_source_url,
source_id as file_source_id,
status as file_status

