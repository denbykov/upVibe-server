--liquibase formatted sql
--changeset VolodymyrFihurniak:9

INSERT INTO user_playlist_files (file_id, user_playlist_id, missing_from_remote)
SELECT uf.file_id, up.id, FALSE
FROM user_files AS uf
JOIN user_playlists AS up ON up.user_id = uf.user_id
AND NOT EXISTS (
    SELECT 1
    FROM user_playlist_files upf
    WHERE upf.file_id = uf.file_id AND upf.user_playlist_id = up.id
);
