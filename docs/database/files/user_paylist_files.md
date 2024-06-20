# About

This page describes the public.user_playlists table

![alt text](user_paylist_files.png)

## Structure definition

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY |
| file_id | BIGINT | NOT NULL,<br/> FK to public.files(id) |
| user_playlist_id | BIGINT | NOT NULL,<br/> FK to public.playlists(id) |
| missing_from_remote | BOOLEAN | NOT NULL, DEFAULT FALSE |