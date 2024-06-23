--liquibase formatted sql
--changeset VolodymyrFihurniak:10

ALTER TABLE playlists ALTER COLUMN title DROP NOT NULL;
