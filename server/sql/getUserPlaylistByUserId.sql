SELECT
  *
FROM
  user_playlists as up
WHERE
  up.user_id = $1
  AND up.playlist_id = $2
