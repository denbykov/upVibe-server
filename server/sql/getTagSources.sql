SELECT tag_sources.id as tag_sources_id,
tag_sources.description as tag_sources_description,
tag_sources.logo_path as tag_sources_logo_path
FROM tag_sources
WHERE tag_sources.description = $1
