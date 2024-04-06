SELECT
user_id as tag_mapping_priority_user_id,
ARRAY_AGG(source) as tag_mapping_priority_source,
ARRAY_AGG(title) as tag_mapping_priority_title,
ARRAY_AGG(artist) as tag_mapping_priority_artist,
ARRAY_AGG(album) as tag_mapping_priority_album,
ARRAY_AGG(picture_id) as tag_mapping_priority_picture,
ARRAY_AGG(year) as tag_mapping_priority_year,
ARRAY_AGG(track_number) as tag_mapping_priority_track_number
FROM
tag_mapping_priority as tmp
WHERE user_id = $1
GROUP BY user_id
