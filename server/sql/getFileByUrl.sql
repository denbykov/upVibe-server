SELECT
f.id as file_id,
f.sources as file_sources,
f.path as file_path,
f.status as file_status,
f.source_url as file_source_url
FROM files as f
WHERE f.source_url = $1
