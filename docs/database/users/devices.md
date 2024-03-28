# About  

This page describes the public.users table  

![alt text](devices.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id | UUID | PK |
| user_id | INT | PK,<br/> FK to public.users(id) |
| name | VARCHAR(255) |