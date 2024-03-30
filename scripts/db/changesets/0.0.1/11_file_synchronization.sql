--liquibase formatted sql
--changeset VolodymyrFihurniak:11

CREATE TABLE file_synchronization (
    device_id INT NOT NULL,
    user_file_id INT NOT NULL,
    is_synchronized BOOLEAN NOT NULL,
    marked_for_deletion BOOLEAN NOT NULL,
    server_ts TIMESTAMP NOT NULL,
    device_ts TIMESTAMP NOT NULL,
    CONSTRAINT pk_file_synchronization PRIMARY KEY (device_id, user_file_id),
    CONSTRAINT fk_device_id_file_synchronization FOREIGN KEY (device_id) REFERENCES devices(id),
    CONSTRAINT fk_user_file_id_file_synchronization FOREIGN KEY (user_file_id) REFERENCES user_files(id)
);
