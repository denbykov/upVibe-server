INSERT INTO
  user_playlists (user_id, playlist_id, added_ts)
VALUES
  ($1, $2, $3)
RETURNING
  *
