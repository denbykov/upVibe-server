--liquibase formatted sql
--changeset VolodymyrFihurniak:10

CREATE TABLE devices (
    id UUID NOT NULL UNIQUE,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT pk_devices PRIMARY KEY (id, user_id),
    CONSTRAINT fk_user_id_devices FOREIGN KEY (user_id) REFERENCES users(id)
);
