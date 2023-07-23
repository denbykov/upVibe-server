--liquibase formatted sql
--changeset sowa:2

CREATE TABLE file_types (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);
