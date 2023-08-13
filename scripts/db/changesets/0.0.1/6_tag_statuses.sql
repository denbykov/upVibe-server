--liquibase formatted sql
--changeset sowa:6

CREATE TABLE tag_statuses (
    status CHAR PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

INSERT INTO tag_statuses (status, description) VALUES ('N', 'New tag');
INSERT INTO tag_statuses (status, description) VALUES ('A', 'Approved tag');
INSERT INTO tag_statuses (status, description) VALUES ('R', 'Rejected tag');
