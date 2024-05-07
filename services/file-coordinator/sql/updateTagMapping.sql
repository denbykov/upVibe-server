UPDATE tag_mappings
SET
  title = $1,
  artist = $2,
  album = $3,
  picture = $4,
  year = $5,
  track_number = $6,
  fixed = $7
WHERE
  file_id = $8
