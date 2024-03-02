SELECT files.id as file_id,
files.path as file_path,
file_sources.id as file_sources_id,
files.source_url as file_sources_url,
file_sources.description as file_sources_description,
file_sources.logo_path as file_sources_logo_path,
files.status as file_status
FROM files
INNER JOIN file_sources ON files.source_id = file_sources.id
WHERE source_url = $1
