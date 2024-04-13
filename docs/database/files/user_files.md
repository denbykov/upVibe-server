# About  

This page describes the public.user_files table  

![Alt text](user_files.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY |
| user_id | INT | PK,<br/> FK to public.users(id) |
| file_id | INT | PK,<br/> FK to public.files(id) |
| added_ts | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
