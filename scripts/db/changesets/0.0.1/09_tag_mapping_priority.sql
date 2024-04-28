--liquibase formatted sql
--changeset VolodymyrFihurniak:9

CREATE TABLE tag_mapping_priority (
    user_id INT NOT NULL,
    source INT NOT NULL,
    title SMALLINT NOT NULL,
    artist SMALLINT NOT NULL,
    album SMALLINT NOT NULL,
    picture SMALLINT NOT NULL,
    year SMALLINT NOT NULL,
    track_number SMALLINT NOT NULL,
    PRIMARY KEY (user_id, source),
    CONSTRAINT fk_user_id_tag_mapping_priority FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_source_tag_mapping_priority FOREIGN KEY (source) REFERENCES sources(id)
);
