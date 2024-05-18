SELECT
  t.id AS tag_id,
  t.file_id AS tag_file_id,
  t.is_primary AS tag_is_primary,
  t.source AS tag_source,
  t.status AS tag_status,
  t.title AS tag_title,
  t.artist AS tag_artist,
  t.album AS tag_album,
  t.year AS tag_year,
  t.track_number AS tag_track_number,
  t.picture_path AS tag_picture_path
FROM
  tags AS t
WHERE
  t.file_id = $1
  AND t.source = $2
