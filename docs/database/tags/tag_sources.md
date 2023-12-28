# About  

This page describes the public.tag_sources table  

![Alt text](tag_sources.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | SERIAL | PK |
| description | VARCHAR(255) | NOT NULL |
| logo_path | VARCHAR(255) | NOT NULL, UNIQUE |