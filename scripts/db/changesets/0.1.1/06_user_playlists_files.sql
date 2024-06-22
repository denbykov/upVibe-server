--liquibase formatted sql
--changeset VolodymyrFihurniak:6

CREATE TABLE user_playlist_files (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    file_id BIGINT NOT NULL,
    user_playlist_id BIGINT NOT NULL,
    missing_from_remote BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_user_playlist_files_id FOREIGN KEY (file_id) REFERENCES files(id),
    CONSTRAINT fk_user_playlist_files_user_playlists_id FOREIGN KEY (user_playlist_id) REFERENCES user_playlists(id)
);
