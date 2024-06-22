--liquibase formatted sql
--changeset VolodymyrFihurniak:7

ALTER TABLE file_synchronization DROP COLUMN marked_for_deletion;
