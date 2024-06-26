--liquibase formatted sql
--changeset VolodymyrFihurniak:5

CREATE TABLE user_files (
    id BIGINT UNIQUE GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    file_id INT NOT NULL,
    added_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user_files PRIMARY KEY (id, user_id, file_id),
    CONSTRAINT fk_user_id_user_files FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_file_id_user_files FOREIGN KEY (file_id) REFERENCES files(id)
);
