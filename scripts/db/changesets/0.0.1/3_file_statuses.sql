--liquibase formatted sql
--changeset sowa:3

CREATE TABLE file_statuses (
    status VARCHAR(1) PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);
