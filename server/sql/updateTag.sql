UPDATE tags
SET
  is_primary = $2,
  source = $3,
  status = $4,
  title = $5,
  artist = $6,
  album = $7,
  year = $8,
  track_number = $9,
  picture_path = $10
WHERE
  id = $1
RETURNING
  id as tag_id,
  file_id as tag_file_id,
  is_primary as tag_is_primary,
  source as tag_source,
  status as tag_status,
  title as tag_title,
  artist as tag_artist,
  album as tag_album,
  year as tag_year,
  track_number as tag_track_number,
  picture_path as tag_picture_path
