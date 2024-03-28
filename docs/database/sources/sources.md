# About

This page describes the public.sources table

![alt text](sources.png)

## Structure definition

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | SERIAL | PK |
| description | VARCHAR(255) | NOT NULL |
| allow_for_secondary_tag_parsing | BOOLEAN | NOT NULL |
| logo_path | VARCHAR(255) | NOT NULL |
