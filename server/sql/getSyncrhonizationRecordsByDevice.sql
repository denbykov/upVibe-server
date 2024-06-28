SELECT
  *
FROM
  synchronization_records
WHERE
  device_id = $1
  AND user_file_id = $2
