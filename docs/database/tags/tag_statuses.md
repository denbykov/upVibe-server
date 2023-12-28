# About  

This page describes the public.tag_statuses table  

![Alt text](tag_statuses.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| status  | VARCHAR(2) | PK |
| description  | VARCHAR | NOT NULL |

## Data definition 

| status | description |
| - | - |
| 'С'  | 'Completed' |
| 'E'  | 'Error' |
| 'I'  | 'In Progress' |
| 'P'  | 'Pending' |