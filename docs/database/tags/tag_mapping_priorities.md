# About

This page describes the public.tag_mapping_priorities table

![Alt text](tag_mapping_priorities.png)

## Structure definition

| Column | Type | Constraints | Description |
| - | - | - | - |
| user_id | INT | PK,<br/> FK to public.users(id) |
| source | INT | NOT NULL,<br/> FK to public.sources(id) |
| title | SMALLINT | NOT NULL |
| artist | SMALLINT | NOT NULL |
| album | SMALLINT | NOT NULL |
| picture | SMALLINT | NOT NULL |
| year | SMALLINT | NOT NULL |
| track_number | SMALLINT | NOT NULL |
