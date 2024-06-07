# About

This page describes the public.playlists table

![alt text](image.png)

## Structure definition

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY |
| source_url | VARCHAR(255) | UNIQUE, IDX |
| added_ts | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| title | VARCHAR(255) | NOT NULL |

## Data definition 

| source_url | added_ts | title
| - | - | - |
| NULL  | NOW() | Default |
