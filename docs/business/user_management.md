# upVibe-server

This document describes user management details.

# Content

- [Overview](#overview)
- [Permissions](#permissions)
- [User handling](#user-handling)

# Overview

This implementation of the server relies on auth0 for user authentication and authorization. Naturally, it means that auth0 is handling user creation. But we also need to store some internal information about the user to connect him with respective resources. This information is stored in the [users](../database/users/users.md) table, and logic is described in [User handling](#user-handling).

# Permissions

User permissions should be configured in the auth0, for example, using its RBAC capabilities. User permissions should be included in the access token as the "permissions" claim. It all means that the token should not be opaque.

Server recognizes following permissions:
- user - grants access to basic user functionality.

# User handling

This functionality should be executed on each endpoint that requires authentication after the access token validation and before business logic execution. It must provide the user`s data to the respective business logic part in the case of successful execution or abort an operation. 

#### AC 1

When the server receives an authorized request from the user, it should parse an access token.

Does the token contain all permissions required by the business logic?
- yes - go to AC 2
- no - reject request with error code 403

#### AC 2

Get the user's id from the "sub" claim of the access token and use it to find the respective record in the [users](../database/users/users.md) table.
Does the record exist?
- yes - go to AC 4
- no - go to AC 3

#### AC 3

Request the user's nickname from the auth0 /userinfo endpoint. Then insert the record into the [users](../database/users/users.md) table with the following values:  
sub = access_token.sub  
id = next id  
name = user_info.nickname  

Go to AC 5

#### AC 4

Read user's data from the [users](../database/users/users.md) table filtering by:  
sub = access_token.sub 

#### AC 5

Pass the user's data to the next layer.

