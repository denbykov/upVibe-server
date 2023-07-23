--liquibase formatted sql
--changeset sowa:4

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    source_type SERIAL NOT NULL,
    status_id SERIAL NOT NULL,
    status_description VARCHAR(255) NOT NULL,
    CONSTRAINT fk_source_type_files FOREIGN KEY (source_type) REFERENCES file_types(id),
    CONSTRAINT fk_status_id_files FOREIGN KEY (status_id) REFERENCES file_statuses(id)
);
