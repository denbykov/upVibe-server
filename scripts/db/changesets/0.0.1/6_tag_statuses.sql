--liquibase formatted sql
--changeset sowa:6

CREATE TABLE tag_statuses (
    status VARCHAR(2) PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

INSERT INTO tag_statuses (status, description) VALUES ('C', 'Completed');
INSERT INTO tag_statuses (status, description) VALUES ('E', 'Error');
INSERT INTO tag_statuses (status, description) VALUES ('I', 'In Progress');
INSERT INTO tag_statuses (status, description) VALUES ('P', 'Pending');
