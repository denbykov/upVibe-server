# About  

This page describes the public.tag_mapping_priorities table  

![Alt text](tag_mapping_priorities.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| user_id | SERIAL | PK,<br/> FK to public.users(id) |
| source | SERIAL | NOT NULL,<br/> FK to public.tag_sources(id) |
| title | SMALLINT | NOT NULL |
| artist | SMALLINT | NOT NULL |
| album | SMALLINT | NOT NULL |
| picture_id | SMALLINT | NOT NULL |
| year | SMALLINT | NOT NULL |
| track_number | SMALLINT | NOT NULL |