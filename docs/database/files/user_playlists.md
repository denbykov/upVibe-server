# About

This page describes the public.user_playlists table

![alt text](user_platlists.png)

## Structure definition

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY |
| user_id | BIGINT | NOT NULL,<br/> FK to public.users(id) |
| playlist_id | BIGINT | NOT NULL,<br/> FK to public.playlists(id) |
| added_ts | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP |