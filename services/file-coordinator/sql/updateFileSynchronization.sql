UPDATE file_synchronization
SET
  is_synchronized = $1,
  server_ts = $2
WHERE
  user_file_id = $3
