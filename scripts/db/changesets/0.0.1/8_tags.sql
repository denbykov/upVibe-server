--liquibase formatted sql
--changeset sowa:8

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    file_id SERIAL NOT NULL,
    title VARCHAR(255) NULL,
    artist VARCHAR(255) NULL,
    album VARCHAR(255) NULL,
    picture_path VARCHAR(255) NULL,
    year TIMESTAMP NULL,
    track_number INT NULL,
    source_type SERIAL NOT NULL,
    status CHAR NOT NULL,
    CONSTRAINT fk_file_id_tags FOREIGN KEY (file_id) REFERENCES files(id),
    CONSTRAINT fk_source_type_tags FOREIGN KEY (source_type) REFERENCES tag_sources(id),
    CONSTRAINT fk_status_tags FOREIGN KEY (status) REFERENCES tag_statuses(status)
);
