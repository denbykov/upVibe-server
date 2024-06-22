--liquibase formatted sql
--changeset VolodymyrFihurniak:1

ALTER TABLE tags ADD COLUMN user_id BIGINT NULL;
ALTER TABLE tags ADD CONSTRAINT fk_user_id_tags FOREIGN KEY (user_id) REFERENCES users(id);
