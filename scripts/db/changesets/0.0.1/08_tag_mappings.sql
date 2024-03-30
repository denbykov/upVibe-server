--liquibase formatted sql
--changeset sowa:8

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
    CONSTRAINT fk_title_tag_mappings FOREIGN KEY (title) REFERENCES sources(id),
    CONSTRAINT fk_artist_tag_mappings FOREIGN KEY (artist) REFERENCES sources(id),
    CONSTRAINT fk_album_tag_mappings FOREIGN KEY (album) REFERENCES sources(id),
    CONSTRAINT fk_picture_tag_mappings FOREIGN KEY (picture) REFERENCES sources(id),
    CONSTRAINT fk_year_tag_mappings FOREIGN KEY (year) REFERENCES sources(id),
    CONSTRAINT fk_track_number_tag_mappings FOREIGN KEY (track_number) REFERENCES sources(id)
);