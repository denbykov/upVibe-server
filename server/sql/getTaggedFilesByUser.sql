SELECT
f.id as file_id,
s.id as source_id,
s.description as source_description,
s.allow_for_secondary_tag_parsing as source_allow_for_secondary_tag_parsing,
s.logo_path as source_logo_path
f.status as file_status,
f.source_url as file_source_url,
(SELECT title FROM tags as t WHERE t.file_id = f.id AND t.source = tm.title) as tag_title,
(SELECT artist FROM tags as t WHERE t.file_id = f.id AND t.source = tm.artist) as tag_artist,
(SELECT album FROM tags as t WHERE t.file_id = f.id AND t.source = tm.album) as tag_album,
(SELECT year FROM tags as t WHERE t.file_id = f.id AND t.source = tm.year) as tag_year,
(SELECT track_number FROM tags as t WHERE t.file_id = f.id AND t.source = tm.track_number) as tag_track_number,
tm.picture as tag_picture_id
FROM files as f
JOIN sources as s ON f.source_id = s.id
LEFT JOIN tag_mappings as tm ON f.id = tm.file_id AND tm.user_id = $1
INNER JOIN user_files as uf ON f.id = uf.file_id
WHERE uf.user_id = $1
