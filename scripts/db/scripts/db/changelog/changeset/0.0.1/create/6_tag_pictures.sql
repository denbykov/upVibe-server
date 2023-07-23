--liquibase formatted sql
--changeset sowa:6

CREATE TABLE tag_pictures (
    id SERIAL PRIMARY KEY,
    path VARCHAR(255) NOT NULL
);
