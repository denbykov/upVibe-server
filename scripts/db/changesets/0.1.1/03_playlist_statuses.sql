--liquibase formatted sql
--changeset VolodymyrFihurniak:3

CREATE TABLE playlist_statuses (
    status VARCHAR(2) PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

INSERT INTO playlist_statuses (status, description) VALUES ('CR', 'Created');
INSERT INTO playlist_statuses (status, description) VALUES ('S', 'Synchronized');
INSERT INTO playlist_statuses (status, description) VALUES ('E', 'Error');
