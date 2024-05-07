UPDATE file_synchronization
SET
  is_synchronized = $1,
  server_ts = $2
WHERE
  device_id = $3
  AND user_file_id = $4
