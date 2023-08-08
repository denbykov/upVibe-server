--liquibase formatted sql
--changeset sowa:6

CREATE TABLE tag_statuses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);
