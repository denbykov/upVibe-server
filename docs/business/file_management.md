# File management

This document describes file management details, such as file downloading, synchronization, and tagging.

# Content

- [Plugins](#plugins)
- [Downloading](#downloading)
- [Tag parsing](#tag-parsing)

# Plugins  

The server relies on plugins to perform such actions as file downloading, parsing, etc. The current version requires the following plugins:
- Downloader  
This plugin is responsible for the file.source_url parsing and validation and communication with downloading workers. For example, the amqp message produced by this plugin should look like the following:
```json
routing-key: downloading/file-source-name
body:
{
    "file_id": 1,
    "url": "some/url",
    "uuid": "uuid",
}
```
- Parser  
This plugin is responsible for the communication with parsing workers. For example, the amqp message produced by this plugin should look like one of the following:
```json
routing-key: parsing/native/file-source-name
body:
{
    "file_id": 1,
    "url": "some/url"
}
```
```json
routing-key: parsing/source-name
body:
{
    "tag_id": 1
}
```

# Downloading  

The client can request the server to download a file via POST /up-vibe/v1/files request. The client has to pass a request with the following JSON structure in the body:
```json
{
    "url": "some/url"
}
```

The server should:

#### AC 1

Try to find a record in the [files](../database/files/files.md) table by the following filter:  
source_url = request.body.url  

Does the record exist?
- yes - go to AC 7
- no - go to AC 2

#### AC 2

Generate the unique universal id for the requested file and try to create a new record in the [files](../database/files/files.md) table with the following values:  
path = UUID  
source_url = request.body.url  
status = "CR"  

#### AC 3

Does the file creation fail because the UUID is taken?
- yes - go to AC 1
- no - go to AC 3

#### AC 4

Request file downloading via its downloader plugin.  
Value mapping for the request:  
file_id = created_file.id  
url = request.body.url  
uuid = UUID  

Does the plugin report an error?
- yes - abort the operation and send the error response to the user (errorCode -1)
- no - continue

#### AC 5

Create a record in the [tags](../database/tags/tags.md) table with the following values:  
file_id = created_file.id   
source = 1  
status = "CR"  

#### AC 6

Request tag parsing via its parser plugin.  
Value mapping for the request:  
tag_id = created_tag.id  
url = request.body.url  

Does the plugin report an error?
- yes - abort the operation and send the error response to the user (errorCode -1)
- no - send a successful response to the user

#### AC 7

Create a record in the [user_files](../database/files/user_files.md) table with the following values:  
user_id = request.user.id   
file_id = (created_file / found_file).id  

#### AC 8

Create a record in the [tag_mappings](../database/tags/tag_mappings.md) table with the following values:  
user_id = request.user.id   
file_id = (created_file / found_file).id  
and all tags according to the user's mapping priority

# Tag parsing  

The client can request the server to create and parse tags via POST /up-vibe/v1/files/{fileId}/tags request. The client has to pass a request with the related file id as a url parameter.

The server should:

#### AC 1

Try to find a record in the [tags](../database/tags/tags.md) table by the following filter:  
file_id = request.url.file_id  
source = 1  

Does the record exist?  
- yes - go to AC 2  
- no - abort the operation and send the "Native tag is not found" (errorCode 1) error response to the user  

#### AC 2

Check the status of the found native tag.

If a status is:
- "С" - go to AC 3
- "E" - abort the operation and send the "Native tag parsing is failed" (errorCode 2) error response to the user   
- otherwise - abort the operation and send the "Native tag is being parsed" (errorCode 3) error response to the user

#### AC 3

Create records in the [tags](../database/tags/tags.md) table with the following values:  
file_id = request.url.file_id  
source = [all sources except for 1]  
status = "CR"  

#### AC 4

Request tag parsing via its parser plugin.  
Value mapping for the request:  
tag_id = [created_tag.id]  

Does the plugin report an error?  
- yes - abort the operation and send the error response to the user (errorCode -1)  
- no - send a successful response to the user

# Tag mappings  

This section describes only an idea around tag mappings, as the business logic of the API is just a set of CRUD operations.  
So, the idea is to create a tag mapping for each file, which will tell what tags to apply to the file before sending it to the user. It should be created when the user requests file downloading(#downloading). Each priority item could be modified via the API.
Mapping priority is an object unique for each user and is used to create a default tag_mapping for the file.