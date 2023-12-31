# About  

This page describes the public.tags table  

![Alt text](tags.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | SERIAL | PK |
| file_id | SERIAL | NOT NULL,<br/> FK to public.files(id) |
| title | VARCHAR(255) |
| artist | VARCHAR(255) |
| album | VARCHAR(255) |
| picture_path | VARCHAR(255) |
| year | TIMESPAMP |
| track_number | INT |
| source_type | SERIAL | NOT NULL,<br/> FK to public.tag_sources(id) |
| status | CHAR | NOT NULL,<br/> FK to public.tag_statuses(status) |