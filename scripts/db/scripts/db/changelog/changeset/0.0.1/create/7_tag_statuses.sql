--liquibase formatted sql
--changeset sowa:7

CREATE TABLE tag_statuses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);
