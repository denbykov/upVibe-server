# About  

This page describes the public.tag_statuses table  

![Alt text](tag_statuses.png)

# Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| status  | CHAR | PK |
| description  | VARCHAR(255) | NOT NULL |

# Data definition 

| status | description |
| - | - |
| 'С'  | 'Completed' |
| 'E'  | 'Error' |
| 'I'  | 'In Progress' |
| 'P'  | 'Pending' |