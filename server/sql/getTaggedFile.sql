SELECT
  f.id as file_id,
  s.id as source_id,
  s.description as source_description,
  s.allow_for_secondary_tag_parsing as source_allow_for_secondary_tag_parsing,
  s.logo_path as source_logo_path,
  f.status as file_status,
  f.source_url as file_source_url,
  fs.is_synchronized as is_synchronized,
  (
    SELECT
      title
    FROM
      tags as t
    WHERE
      t.id = tm.title
  ) as tag_title,
  (
    SELECT
      artist
    FROM
      tags as t
    WHERE
      t.id = tm.artist
  ) as tag_artist,
  (
    SELECT
      album
    FROM
      tags as t
    WHERE
      t.id = tm.album
  ) as tag_album,
  (
    SELECT
      year
    FROM
      tags as t
    WHERE
      t.id = tm.year
  ) as tag_year,
  (
    SELECT
      track_number
    FROM
      tags as t
    WHERE
      t.id = tm.track_number
  ) as tag_track_number,
  tm.picture as tag_picture
FROM
  files as f
  LEFT JOIN sources as s ON f.source = s.id
  LEFT JOIN tag_mappings as tm ON f.id = tm.file_id
  AND tm.user_id = $3
  LEFT JOIN user_files as uf ON f.id = uf.file_id
  LEFT JOIN file_synchronization as fs ON fs.user_file_id = uf.file_id
  AND fs.device_id = $2
WHERE
  f.id = $1
