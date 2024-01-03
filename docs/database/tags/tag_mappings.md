# About  

This page describes the public.tag_mappings table  

![Alt text](tag_mappings.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | SERIAL | PK |
| user_id | INT | FK to public.users(id) |
| file_id | INT | NOT NULL,<br/> FK to public.files(id) |
| title | INT | NOT NULL,<br/> FK to public.tag_sources(id) |
| artist | INT | NOT NULL,<br/> FK to public.tag_sources(id) |
| album | INT | NOT NULL,<br/> FK to public.tag_sources(id) |
| picture | INT | NOT NULL,<br/> FK to public.tag_sources(id) |
| year | INT | NOT NULL,<br/> FK to public.tag_sources(id) |
| track_number | INT | NOT NULL,<br/> FK to public.tag_sources(id) |