--liquibase formatted sql
--changeset sowa:4

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    source_url VARCHAR(255) NOT NULL,
    source_id SERIAL NOT NULL,
    status VARCHAR(1) NOT NULL,
    CONSTRAINT fk_source_id_files FOREIGN KEY (source_id) REFERENCES file_sources(id),
    CONSTRAINT fk_status_files FOREIGN KEY (status) REFERENCES file_statuses(status)
);
