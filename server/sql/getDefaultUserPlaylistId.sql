SELECT
  up.id
FROM
  user_playlists AS up
  JOIN playlists AS p ON up.playlist_id = p.id
WHERE
  p.title ILIKE 'Default'
  AND up.user_id = $1;
