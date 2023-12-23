# About  

This page describes the public.files table  

![Alt text](files.png)

# Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | SERIAL | PK |
| path | VARCHAR(255) | NULL, UNIQUE |
| source_url | VARCHAR(255) | NOT NULL, UNIQUE |
| source_id | SERIAL | NOT NULL,<br/> FK to public.file_sources(id) |
| status | VARCHAR(1) | NOT NULL,<br/> FK to public.file_statuses(status) |