INSERT INTO
  user_playlist_files (user_playlist_id, file_id, missing_from_remote)
VALUES
  ($1, $2, FALSE);
