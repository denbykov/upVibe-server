SELECT id as file_source_id,
description as file_source_description,
logo_path as file_source_logo_path
FROM file_sources
WHERE id = $1
