--liquibase formatted sql
--changeset sowa:8

CREATE TABLE tag_sources (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);
