# User management

This document describes user management details.

# Content

- [Overview](#overview)
- [Permissions](#permissions)
- [User handling](#user-handling)

# Overview

This implementation of the server relies on auth0 for user authentication and authorization. Naturally, it means that auth0 is handling user creation. But we also need to store some internal information about the user to connect him with respective resources. This information is stored in the [users](../../database/users/users.md) table, and logic is described in [User handling](#user-handling).

# Permissions

User permissions should be configured in the auth0, for example, using its RBAC capabilities. User permissions should be included in the access token as the "permissions" claim. It all means that the token should not be opaque.

The server recognizes the following permissions:
- user - grants access to basic user functionality.

# User registration

The server does not perform conventional user registration and credentials containment. But it does need a user to be added to its database, as well as the current device user is using.  
To achieve this, after the authentication via auth0, the client should generate uuid and send a registration request to the server via POST /up-vibe/v1/register request. The client has to pass a request with the related file id as a url parameter.

The server should:

#### AC 1

Get the user's id from the "sub" claim of the access token and use it to find the respective record in the [users](../../database/users/users.md) table filtering by:  
sub = access_token.sub  
Does the record exist?
- yes - go to AC 3
- no - continue

#### AC 2

Request the user's nickname from the auth0 /userinfo endpoint. Then, insert the record into the [users](../../database/users/users.md) table with the following values:  
sub = access_token.sub  
name = user_info.nickname  

#### AC 2.1

Create a record in the [tag_mapping_priorities](../../database/tags/tag_mapping_priorities.md) table according to the configuration(for more details see [file management](../../file_management.md) Tag mapping priorities)  

#### AC 2.2

Create a record in the [user_playlists](../../database/files/user_playlists.md) table for 'Default' playlist  

#### AC 3

Insert record in the [devices](../../database/users/devices.md) table with the following values:  
id = request.body.deviceId  
user_id = (created_user/read_user).id  
name = request.body.deviceName  

#### AC 4

For each record in the [user_files](../../database/files/user_files.md) table filtering by:  
user_id = (created_user/read_user).id  

Insert record in the [file_synchronization](../../database/files/file_synchronization.md) table with the following values:  
device_id = created_device.id  
user_file_id = record.id  

# User handling middeware

This functionality should be executed on each endpoint that requires authentication after the access token validation and before business logic execution. It must provide the user`s data to the respective business logic part in the case of successful execution or abort an operation. 

#### AC 1

When the server receives an authorized request from the user, it should parse an access token.

Does the token contain all permissions required by the business logic?
- yes - go to AC 2
- no - reject request with error code 403

#### AC 2

Get the user's id from the "sub" claim of the access token and use it to find the respective record in the [users](../../database/users/users.md) table filtering by:  
sub = access_token.sub  
Does the record exist?
- yes - continue
- no - reject request with error code 403

#### AC 3

Pass the user's data to the next layer.
