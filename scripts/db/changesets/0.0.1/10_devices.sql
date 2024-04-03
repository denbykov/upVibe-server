--liquibase formatted sql
--changeset VolodymyrFihurniak:10

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_id_devices FOREIGN KEY (user_id) REFERENCES users(id)
);
