--liquibase formatted sql
--changeset sowa:14

CREATE TABLE access_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    parent_id SERIAL NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_parent_id_access_tokens FOREIGN KEY (parent_id) REFERENCES refresh_tokens(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_user_id_access_tokens FOREIGN KEY (user_id) REFERENCES users(id)
);
