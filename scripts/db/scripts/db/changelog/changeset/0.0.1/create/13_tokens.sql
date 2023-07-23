--liquibase formatted sql
--changeset sowa:13

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id SERIAL NOT NULL,
    token VARCHAR(255) NOT NULL,
    refresh_token_id SERIAL NOT NULL UNIQUE,
    CONSTRAINT fk_refresh_token_id_tokens FOREIGN KEY (refresh_token_id) REFERENCES refresh_tokens(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_user_id_tokens FOREIGN KEY (user_id) REFERENCES users(id)
);
