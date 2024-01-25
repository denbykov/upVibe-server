--liquibase formatted sql
--changeset sowa:2

CREATE TABLE file_sources (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    logo_path VARCHAR(255) NOT NULL UNIQUE
);
