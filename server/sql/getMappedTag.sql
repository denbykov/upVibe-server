SELECT
  t1.title as tag_title,
  t2.artist as tag_artist,
  t3.album as tag_album,
  t4.year as tag_year,
  t5.track_number as tag_track_number,
  t6.picture_path as tag_picture_path
FROM
  tag_mappings as tm
  LEFT JOIN tags as t1 on t1.file_id = $1 and t1.source = tm.title
  LEFT JOIN tags as t2 ON t2.file_id = $1 and t2.source = tm.artist
  LEFT JOIN tags as t3 ON t3.file_id = $1 and t3.source = tm.album
  LEFT JOIN tags as t4 ON t4.file_id = $1 and t4.source = tm.year
  LEFT JOIN tags as t5 ON t5.file_id = $1 and t5.source = tm.track_number
  LEFT JOIN tags as t6 ON t6.file_id = $1 and t6.source = tm.picture
WHERE
  tm.file_id = $1
  AND tm.user_id = $2;
