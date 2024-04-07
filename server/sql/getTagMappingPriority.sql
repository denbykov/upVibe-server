SELECT
  user_id as tag_mapping_priority_user_id,
  JSON_AGG(JSON_BUILD_OBJECT('id', title, 'source', source)) as tag_mapping_priority_title,
  JSON_AGG(JSON_BUILD_OBJECT('id', artist, 'source', source)) as tag_mapping_priority_artist,
  JSON_AGG(JSON_BUILD_OBJECT('id', album, 'source', source)) as tag_mapping_priority_album,
  JSON_AGG(
    JSON_BUILD_OBJECT('id', picture_id, 'source', source)
  ) as tag_mapping_priority_picture,
  JSON_AGG(JSON_BUILD_OBJECT('id', year, 'source', source)) as tag_mapping_priority_year,
  JSON_AGG(
    JSON_BUILD_OBJECT('id', track_number, 'source', source)
  ) as tag_mapping_priority_track_number
FROM
  tag_mapping_priority as tmp
WHERE
  user_id = 1
GROUP BY
  user_id;
