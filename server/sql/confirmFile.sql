update file_synchronization as fs
set
  is_synchronized = true,
  device_ts = $4
from
  user_files as uf
where
  fs.user_file_id = uf.id
  and uf.file_id = $1
  and uf.user_id = $2
  and fs.device_id = $3
