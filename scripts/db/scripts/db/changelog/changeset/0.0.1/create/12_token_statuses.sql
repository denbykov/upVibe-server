--liquibase formatted sql
--changeset sowa:12

CREATE TABLE token_statuses (
    status CHAR(1) PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);

INSERT INTO token_statuses (status, description) VALUES ('A', 'Active');
INSERT INTO token_statuses (status, description) VALUES ('I', 'Inactive');
