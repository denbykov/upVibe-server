SELECT
  user_id as tag_mapping_priority_user_id,
  source as tag_mapping_priority_source,
  title as tag_mapping_priority_title,
  artist as tag_mapping_priority_artist,
  album as tag_mapping_priority_album,
  picture_id as tag_mapping_priority_picture,
  year as tag_mapping_priority_year,
  track_number as tag_mapping_priority_track_number
FROM
  tag_mapping_priority
WHERE
  user_id = $1
