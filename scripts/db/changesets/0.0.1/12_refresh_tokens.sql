--liquibase formatted sql
--changeset sowa:12

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id BIGINT,
    common_ancestor_id BIGINT,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT fk_status_refresh_tokens FOREIGN KEY (status) REFERENCES token_statuses(status),
    CONSTRAINT fk_user_id_refresh_tokens FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT unique_parent_id_refresh_tokens UNIQUE (parent_id)
);
