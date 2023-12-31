--liquibase formatted sql
--changeset sowa:3

CREATE TABLE file_statuses (
    status VARCHAR(2) PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

INSERT INTO file_statuses (status, description) VALUES ('C', 'Completed');
INSERT INTO file_statuses (status, description) VALUES ('E', 'Error');
INSERT INTO file_statuses (status, description) VALUES ('I', 'In Progress');
INSERT INTO file_statuses (status, description) VALUES ('P', 'Pending');
