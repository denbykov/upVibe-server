SELECT
  id
FROM
  user_files
WHERE
  file_id = $1
  AND user_id = $2
