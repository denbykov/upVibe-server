INSERT INTO
tags
(
    file_id,
    is_primary,
    source,
    status,
    title,
    artist,
    album,
    year,
    track_number,
    picture_path
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
