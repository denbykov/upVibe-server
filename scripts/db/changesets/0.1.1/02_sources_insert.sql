--liquibase formatted sql
--changeset VolodymyrFihurniak:2

INSERT INTO sources (description, allow_for_secondary_tag_parsing, logo_path) VALUES ('custom', FALSE, '/opt/upVibe/storage/logos/custom.svg');
