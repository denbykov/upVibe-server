--liquibase formatted sql
--changeset VolodymyrFihurniak:8

INSERT INTO user_playlists (user_id, playlist_id)
SELECT u.id, 1
FROM users AS u
WHERE NOT EXISTS (
    SELECT 1
    FROM user_playlists AS up
    WHERE up.user_id = u.id AND up.playlist_id = 1
);
