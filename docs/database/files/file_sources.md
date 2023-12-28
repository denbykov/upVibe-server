# About  

This page describes the public.file_sources table  

![Alt text](file_sources.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | SERIAL | PK |
| description | VARCHAR | NOT NULL |
| logo_path | VARCHAR(255) | NOT NULL, UNIQUE |