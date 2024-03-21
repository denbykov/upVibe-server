SELECT
f.id as file_id,
fs.id as file_source_id,
fs.description as file_source_description,
fs.logo_path as file_source_logo_path,
f.status as file_status,
f.source_url as file_source_url,
(SELECT title FROM tags as t WHERE t.id = tm.title) as tag_title,
(SELECT artist FROM tags as t WHERE t.id = tm.artist) as tag_artist,
(SELECT album FROM tags as t WHERE t.id = tm.album) as tag_album,
(SELECT year FROM tags as t WHERE t.id = tm.year) as tag_year,
(SELECT track_number FROM tags as t WHERE t.id = tm.track_number) as tag_track_number,
tm.picture as tag_picture_id
FROM files as f
LEFT JOIN file_sources as fs ON f.source_id = fs.id
LEFT JOIN tag_mappings as tm ON f.id = tm.file_id AND tm.user_id = $2
LEFT JOIN user_files as uf ON f.id = uf.file_id
WHERE f.id = $1
