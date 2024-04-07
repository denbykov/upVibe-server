SELECT
  user_id as tag_mapping_user_id,
  id as tag_mapping_id,
  file_id as tag_mapping_file_id,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'tag_mapping_source_id',
      title,
      'tag_mapping_source',
      (
        SELECT
          description
        FROM
          sources as s
        WHERE
          s.id = title
      )
    )
  ) as tag_mapping_title,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'tag_mapping_source_id',
      artist,
      'tag_mapping_source',
      (
        SELECT
          description
        FROM
          sources as s
        WHERE
          s.id = artist
      )
    )
  ) as tag_mapping_artist,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'tag_mapping_source_id',
      album,
      'tag_mapping_source',
      (
        SELECT
          description
        FROM
          sources as s
        WHERE
          s.id = album
      )
    )
  ) as tag_mapping_album,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'tag_mapping_source_id',
      picture,
      'tag_mapping_source',
      (
        SELECT
          description
        FROM
          sources as s
        WHERE
          s.id = picture
      )
    )
  ) as tag_mapping_picture,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'tag_mapping_source_id',
      year,
      'tag_mapping_source',
      (
        SELECT
          description
        FROM
          sources as s
        WHERE
          s.id = year
      )
    )
  ) as tag_mapping_year,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'tag_mapping_source_id',
      track_number,
      'tag_mapping_source',
      (
        SELECT
          description
        FROM
          sources as s
        WHERE
          s.id = track_number
      )
    )
  ) as tag_mapping_track_number
FROM
  tag_mappings
WHERE
  file_id = $1
GROUP BY
  user_id,
  id,
  file_id
