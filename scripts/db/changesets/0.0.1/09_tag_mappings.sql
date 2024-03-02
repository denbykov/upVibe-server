--liquibase formatted sql
--changeset sowa:9

CREATE TABLE tag_mappings (
    id SERIAL NOT NULL,
    user_id INT NOT NULL,
    file_id INT NOT NULL,
    title INT NOT NULL,
    artist INT NOT NULL,
    album INT NOT NULL,
    picture INT NOT NULL,
    year INT NOT NULL,
    track_number INT NOT NULL,
    CONSTRAINT pk_tag_mappings PRIMARY KEY (id, user_id),
    CONSTRAINT fk_user_id_tag_mappings FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_file_id_tag_mappings FOREIGN KEY (file_id) REFERENCES files(id),
    CONSTRAINT fk_title_tag_mappings FOREIGN KEY (title) REFERENCES tag_sources(id),
    CONSTRAINT fk_artist_tag_mappings FOREIGN KEY (artist) REFERENCES tag_sources(id),
    CONSTRAINT fk_album_tag_mappings FOREIGN KEY (album) REFERENCES tag_sources(id),
    CONSTRAINT fk_picture_tag_mappings FOREIGN KEY (picture) REFERENCES tag_sources(id),
    CONSTRAINT fk_year_tag_mappings FOREIGN KEY (year) REFERENCES tag_sources(id),
    CONSTRAINT fk_track_number_tag_mappings FOREIGN KEY (track_number) REFERENCES tag_sources(id)
);
