--liquibase formatted sql
--changeset VolodymyrFihurniak:11

ALTER TABLE user_playlists
    DROP CONSTRAINT fk_user_playlists_playlists;

ALTER TABLE user_playlists
    ADD CONSTRAINT fk_user_playlists_playlists_id FOREIGN KEY (playlist_id) REFERENCES playlists(id);
