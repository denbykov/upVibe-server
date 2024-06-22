SELECT
  file_id
FROM
  user_files
WHERE
  user_id = $1
LIMIT
  1;
