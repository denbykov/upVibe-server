SELECT
  (
    SELECT
      title
    FROM
      tags as t
    WHERE
      t.source = tm.title
  ) as tag_title,
  (
    SELECT
      artist
    FROM
      tags as t
    WHERE
      t.source = tm.artist
  ) as tag_artist,
  (
    SELECT
      album
    FROM
      tags as t
    WHERE
      t.source = tm.album
  ) as tag_album,
  (
    SELECT
      year
    FROM
      tags as t
    WHERE
      t.source = tm.year
  ) as tag_year,
  (
    SELECT
      track_number
    FROM
      tags as t
    WHERE
      t.source = tm.track_number
  ) as tag_track_number,
  (
    SELECT
      picture_path
    FROM
      tags as t
    WHERE
      t.source = tm.picture
  ) as tag_picture_path
FROM
  files as f
  LEFT JOIN tag_mappings as tm ON f.id = tm.file_id
WHERE
  f.id = $1
  AND tm.user_id = $2
