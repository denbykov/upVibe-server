--liquibase formatted sql
--changeset sowa:2

CREATE TABLE sources (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    allow_for_secondary_tag_parsing BOOLEAN NOT NULL,
    logo_path VARCHAR(255) NOT NULL UNIQUE
);
