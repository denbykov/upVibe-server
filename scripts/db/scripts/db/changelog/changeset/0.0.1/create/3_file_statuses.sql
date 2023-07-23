--liquibase formatted sql
--changeset sowa:3

CREATE TABLE file_statuses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);
