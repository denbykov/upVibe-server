# About

This page describes the public.tags table

![alt text](tags.png)

## Structure definition

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY |
| file_id | INT | NOT NULL,<br/> FK to public.files(id) |
| is_primary | BOOLEAN | NOT NULL,<br/> DEFAULT FALSE |
| title | VARCHAR(255) |
| artist | VARCHAR(255) |
| album | VARCHAR(255) |
| picture_path | VARCHAR(255) |
| year | SMALLINT |
| track_number | INT |
| source | INT | NOT NULL,<br/> FK to public.sources(id) |
| status | VARCHAR(2) | NOT NULL,<br/> FK to public.tag_statuses(status) |
| user_id | INT | FK to public.users(id) |
