SELECT id as tag_source_id,
description as tag_source_description,
logo_path as tag_source_logo_path
FROM tag_sources
WHERE id = $1
