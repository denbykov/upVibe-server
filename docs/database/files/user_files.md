# About  

This page describes the public.user_files table  

![Alt text](user_files.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| user_id | SERIAL | NOT NULL, PK,<br/> FK to public.users(id) |
| file_id | SERIAL | NOT NULL, PK,<br/> FK to public.files(id) |