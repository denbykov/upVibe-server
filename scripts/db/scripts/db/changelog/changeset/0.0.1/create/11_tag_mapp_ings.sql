--liquibase formatted sql
--changeset sowa:11

CREATE TABLE tag_mapp_ings (
    user_id SERIAL PRIMARY KEY,
    id SERIAL NOT NULL,
    file_id SERIAL NOT NULL,
    title SERIAL NOT NULL,
    artist SERIAL NOT NULL,
    album SERIAL NOT NULL,
    picture_id SERIAL NOT NULL,
    year SERIAL NOT NULL,
    track_number  SERIAL NOT NULL,
    CONSTRAINT fk_user_id_tag_mapping FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_id_tag_mapping FOREIGN KEY (id) REFERENCES files(id),
    CONSTRAINT fk_file_id_tag_mapping FOREIGN KEY (file_id) REFERENCES files(id),
    CONSTRAINT fk_title_tag_mapping FOREIGN KEY (title) REFERENCES tag_sources(id),
    CONSTRAINT fk_artist_tag_mapping FOREIGN KEY (artist) REFERENCES tag_sources(id),
    CONSTRAINT fk_album_tag_mapping FOREIGN KEY (album) REFERENCES tag_sources(id),
    CONSTRAINT fk_picture_id_tag_mapping FOREIGN KEY (picture_id) REFERENCES tag_sources(id),
    CONSTRAINT fk_year_tag_mapping FOREIGN KEY (year) REFERENCES tag_sources(id),
    CONSTRAINT fk_track_numbertag_mapping FOREIGN KEY (track_number) REFERENCES tag_sources(id)
);
