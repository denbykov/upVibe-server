--liquibase formatted sql
--changeset VolodymyrFihurniak:5

CREATE TABLE user_playlists (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    playlist_id BIGINT NOT NULL,
    added_ts TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_playlists_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_playlists_playlists FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);
