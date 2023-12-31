# About  

This page describes the public.tag_mappings table  

![Alt text](tag_mappings.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | SERIAL | PK |
| user_id | SERIAL | FK to public.users(id) |
| file_id | SERIAL | NOT NULL,<br/> FK to public.files(id) |
| tag_source | SERIAL | NOT NULL,<br/> FK to public.tag_sources(id) |
| title | SERIAL | NOT NULL |
| artist | SERIAL | NOT NULL |
| album | SERIAL | NOT NULL |
| picture_id | SERIAL | NOT NULL |
| year | SERIAL | NOT NULL |
| track_number | SERIAL | NOT NULL |