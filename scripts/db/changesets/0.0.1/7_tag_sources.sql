--liquibase formatted sql
--changeset sowa:7

CREATE TABLE tag_sources (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL
);