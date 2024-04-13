# About

This page describes the public.tag_mappings table

![Alt text](tag_mappings.png)

## Structure definition

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | BIGINT | PK |
| user_id | INT | FK to public.users(id) |
| file_id | INT | NOT NULL,<br/> FK to public.files(id) |
| title | INT | NOT NULL,<br/> FK to public.sources(id) |
| artist | INT | NOT NULL,<br/> FK to public.sources(id) |
| album | INT | NOT NULL,<br/> FK to public.sources(id) |
| picture | INT | NOT NULL,<br/> FK to public.sources(id) |
| year | INT | NOT NULL,<br/> FK to public.sources(id) |
| track_number | INT | NOT NULL,<br/> FK to public.sources(id) |
