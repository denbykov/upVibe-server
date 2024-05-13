SELECT
  *
FROM
  user_files
WHERE
  user_id = $1
  AND file_id = $2
