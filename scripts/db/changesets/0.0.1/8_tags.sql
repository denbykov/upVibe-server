--liquibase formatted sql
--changeset sowa:8

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    file_id SERIAL NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    picture_path VARCHAR(255) NOT NULL,
    year TIMESTAMP NOT NULL,
    track_number INT NOT NULL,
    source_type SERIAL NOT NULL,
    status_id CHAR NOT NULL,
    CONSTRAINT fk_file_id_tags FOREIGN KEY (file_id) REFERENCES files(id),
    CONSTRAINT fk_source_type_tags FOREIGN KEY (source_type) REFERENCES tag_sources(id),
    CONSTRAINT fk_status_id_tags FOREIGN KEY (status_id) REFERENCES tag_statuses(status)
);
