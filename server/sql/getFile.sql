select
  id as file_id,
  path as file_path,
  source as file_source,
  status as file_status,
  source_url as file_source_url
from
  files
where
  id = $1
