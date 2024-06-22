--liquibase formatted sql
--changeset VolodymyrFihurniak:4

CREATE TABLE playlists (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    source_url VARCHAR(255) UNIQUE,
    source_id INT NOT NULL,
    added_ts TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(2) NOT NULL,
    synchronization_ts TIMESTAMPTZ NULL,
    title VARCHAR(255) NOT NULL,
    CONSTRAINT fk_playlists_sources FOREIGN KEY (source_id) REFERENCES sources(id),
    CONSTRAINT fk_playlists_statuses FOREIGN KEY (status) REFERENCES playlist_statuses(status)
);
INSERT INTO playlists (source_id, status, title)
SELECT id, 'S', 'Default'
FROM sources
WHERE description = 'custom';
