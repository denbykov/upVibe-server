--liquibase formatted sql
--changeset VolodymyrFihurniak:3

CREATE TABLE file_statuses (
    status VARCHAR(2) PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

INSERT INTO file_statuses (status, description) VALUES ('CR', 'Created');
INSERT INTO file_statuses (status, description) VALUES ('C', 'Completed');
INSERT INTO file_statuses (status, description) VALUES ('D', 'Downloaded');
INSERT INTO file_statuses (status, description) VALUES ('E', 'Error');
INSERT INTO file_statuses (status, description) VALUES ('I', 'In Progress');
INSERT INTO file_statuses (status, description) VALUES ('P', 'Pending');
