--liquibase formatted sql
--changeset bykovden:12
ALTER TABLE file_synchronization
ALTER COLUMN device_ts
DROP NOT NULL;

ALTER TABLE file_synchronization
ALTER COLUMN is_synchronized
SET DEFAULT FALSE;

ALTER TABLE file_synchronization
ALTER COLUMN marked_for_deletion
SET DEFAULT FALSE;

ALTER TABLE file_synchronization
ALTER COLUMN server_ts
SET DEFAULT CURRENT_TIMESTAMP;
