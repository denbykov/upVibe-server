--liquibase formatted sql
--changeset VolodymyrFihurniak:7

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    file_id INT NOT NULL,
    title VARCHAR(255) NULL,
    artist VARCHAR(255) NULL,
    album VARCHAR(255) NULL,
    picture_path VARCHAR(255) NULL,
    year SMALLINT NULL,
    track_number INT NULL,
    source INT NOT NULL,
    status VARCHAR(2) NOT NULL,
    CONSTRAINT fk_file_id_tags FOREIGN KEY (file_id) REFERENCES files(id),
    CONSTRAINT fk_source_type_tags FOREIGN KEY (source) REFERENCES sources(id),
    CONSTRAINT fk_status_tags FOREIGN KEY (status) REFERENCES tag_statuses(status)
);
