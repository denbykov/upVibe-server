--liquibase formatted sql
--changeset sowa:4

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    path VARCHAR(255) NULL UNIQUE,
    source_url VARCHAR(255) NOT NULL UNIQUE,
    sources INT NOT NULL,
    status VARCHAR(2) NOT NULL,
    CONSTRAINT fk_sources_files_id FOREIGN KEY (sources) REFERENCES file_sources(id),
    CONSTRAINT fk_status_files FOREIGN KEY (status) REFERENCES file_statuses(status)
);

CREATE INDEX idx_source_url_files ON files (source_url);
