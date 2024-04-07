UPDATE tag_mapping_priorities
SET
  title = $1,
  artist = $2,
  album = $3,
  picture = $4,
  year = $5,
  track_number = $6
WHERE
  user_id = $7
RETURNING
  id as tag_mapping_priority_id,
  user_id as tag_mapping_priority_user_id,
  title as tag_mapping_priority_title,
  artist as tag_mapping_priority_artist,
  album as tag_mapping_priority_album,
  picture as tag_mapping_priority_picture,
  year as tag_mapping_priority_year,
  track_number as tag_mapping_priority_track_number
