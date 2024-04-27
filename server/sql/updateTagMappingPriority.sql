UPDATE tag_mapping_priority
SET
  title = $1,
  artist = $2,
  album = $3,
  picture_id = $4,
  year = $5,
  track_number = $6
WHERE
  user_id = $7
  AND source = $8
RETURNING
  user_id as tag_mapping_priority_user_id,
  source as tag_mapping_priority_source,
  title as tag_mapping_priority_title,
  artist as tag_mapping_priority_artist,
  album as tag_mapping_priority_album,
  picture_id as tag_mapping_priority_picture,
  year as tag_mapping_priority_year,
  track_number as tag_mapping_priority_track_number
