# About  

This page describes the public.users table  

![Alt text](users.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY |
| sub | VARCHAR | PK, IDX |
| name | VARCHAR(255) | NOT NULL |
