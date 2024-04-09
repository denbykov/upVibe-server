--liquibase formatted sql
--changeset denbykov:2

CREATE TABLE sources (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    description VARCHAR(255) NOT NULL,
    allow_for_secondary_tag_parsing BOOLEAN NOT NULL,
    logo_path VARCHAR(255) NOT NULL UNIQUE
);
