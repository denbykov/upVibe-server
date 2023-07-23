--liquibase formatted sql
--changeset sowa:10

CREATE TABLE tag_mapping_priority (
    user_id SERIAL PRIMARY KEY,
    tag_source SERIAL NOT NULL,
    file_id SERIAL NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    picture_id SERIAL NOT NULL,
    year INT NOT NULL,
    track_number INT NOT NULL,
    CONSTRAINT fk_user_id_tag_mapping_priority FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_tag_source_tag_mapping_priority FOREIGN KEY (tag_source) REFERENCES tag_sources(id)
);
