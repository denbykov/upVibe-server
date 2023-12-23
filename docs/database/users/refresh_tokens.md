# About  

This page describes the public.refresh_tokens table  

![Alt text](refresh_tokens.png)

## Structure definition  

| Column | Type | Constraints | Description |
| - | - | - | - |
| id  | SERIAL | PK |
| token | VARCHAR(255) | NOT NULL |
| user_id  | INTEGER | NOT NULL,<br/> FK to public.users(id) |
| parent_id | BIGINT | NOT NULL, UNIQUE |
| common_ancestor_id | BIGINT |
| status | VARCHAR(255) | NOT NULL,<br/> FK to public.token_statuses(status) |

