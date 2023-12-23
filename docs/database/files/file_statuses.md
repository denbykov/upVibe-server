# About  

This page describes the public.file_statuses table  

![Alt text](file_statuses.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| status  | CHAR(1) | PK |
| description  | VARCHAR(255) | NOT NULL |

## Data definition 

| status | description |
| - | - |
| 'С'  | 'Completed' |
| 'E'  | 'Error' |
| 'I'  | 'In Progress' |
| 'P'  | 'Pending' |