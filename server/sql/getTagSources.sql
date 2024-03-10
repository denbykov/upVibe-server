SELECT tag_sources.id as tag_source_id,
tag_sources.description as tag_source_description,
tag_sources.logo_path as tag_source_logo_path
FROM tag_sources
WHERE tag_sources.description = $1
