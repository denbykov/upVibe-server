--liquibase formatted sql
--changeset sowa:9

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    picture_id SERIAL NOT NULL,
    year INT NOT NULL,
    track_number INT NOT NULL,
    source_type SERIAL NOT NULL,
    status_description VARCHAR(255) NOT NULL,
    status_id SERIAL NOT NULL,
    CONSTRAINT fk_picture_id_tags FOREIGN KEY (picture_id) REFERENCES tag_pictures(id),
    CONSTRAINT fk_source_type_tags FOREIGN KEY (source_type) REFERENCES tag_sources(id),
    CONSTRAINT fk_status_id_tags FOREIGN KEY (status_id) REFERENCES tag_statuses(id)
);
