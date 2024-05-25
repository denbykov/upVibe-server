UPDATE file_synchronization
SET
  is_synchronized = FALSE,
  server_ts = $1
WHERE
  user_file_id = $2
