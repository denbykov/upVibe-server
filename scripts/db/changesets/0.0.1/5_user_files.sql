--liquibase formatted sql
--changeset sowa:5

CREATE TABLE user_files (
    user_id INT NOT NULL,
    file_id INT NOT NULL,
    CONSTRAINT pk_user_files PRIMARY KEY (user_id, file_id),
    CONSTRAINT fk_user_id_user_files FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_file_id_user_files FOREIGN KEY (file_id) REFERENCES files(id)
);
