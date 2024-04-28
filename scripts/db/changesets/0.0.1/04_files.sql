--liquibase formatted sql
--changeset VolodymyrFihurniak:4

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE files (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    path VARCHAR(255) NULL UNIQUE,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    source_url VARCHAR(255) NOT NULL UNIQUE,
    source INT NOT NULL,
    status VARCHAR(2) NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_source_files_id FOREIGN KEY (source) REFERENCES sources(id),
    CONSTRAINT fk_status_files FOREIGN KEY (status) REFERENCES file_statuses(status)
);

CREATE INDEX idx_source_url_files ON files (source_url);
