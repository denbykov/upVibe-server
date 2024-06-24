INSERT INTO
  playlists (source_url, source_id, added_ts, status)
VALUES
  ($1, $2, $3, $4)
RETURNING
  *;
