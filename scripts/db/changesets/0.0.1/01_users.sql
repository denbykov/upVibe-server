--liquibase formatted sql
--changeset VolodymyrFihurniak:1

CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sub VARCHAR NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE INDEX users_sub_idx ON users (sub);
