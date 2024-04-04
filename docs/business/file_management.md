# File management

This document describes file management details, such as file downloading, synchronization, and tagging.

# Content

- [Plugins](#plugins)
- [Downloading](#downloading)
- [Tag parsing](#tag-parsing)
- [Tag mappings](#tag-mappings)
- [File receiving](#file-receiving)

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
This plugin should also provide an API for getting source id by the url(getSource method), and an API for url normalization(normalizeUrl).
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

- File tagger    
This plugin is responsible for the file preparation before sending it to the user. It is required for this plugin to return the path to the prepared file immediately, and it should guarantee that file will remain intact for some time after its creation.  

# Downloading  

The client can request the server to download a file via POST /up-vibe/v1/files request. The client has to pass a request with the following JSON structure in the body:
```json
{
    "url": "some/url"
}
```

The server should:

#### AC 1.1

Via the filePlugin perform request.body.url normalization and get sourceId  
normalizedUrl = normalize request.body.url  
sourceId = get source id for request.body.url  

#### AC 1.2

Try to find a record in the [files](../database/files/files.md) table by the following filter:  
source_url = normalizedUrl  

Does the record exist?
- yes - go to AC 6
- no - go to AC 2

#### AC 2

Insert a new record in the [files](../database/files/files.md) table with the following values:  
path = null  
source_url = normalizedUrl  
status = "CR"  

#### AC 3

Request file downloading.  
Value mapping for the request:  
file_id = created_file.id  
url = normalizedUrl  
uuid = created_file.uuid  

#### AC 4

Create a native tag record in the [tags](../database/tags/tags.md) table with the following values:  
file_id = created_file.id   
source = sourceId  
status = "CR"  
is_primary = true

#### AC 5

Request native tag parsing.  
Value mapping for the request:  
tag_id = created_tag.id  
url = normalizedUrl  

#### AC 6

Create a record in the [user_files](../database/files/user_files.md) table with the following values:  
user_id = request.user.id  
file_id = (created_file / found_file).id  

#### AC 7

Create a record in the [tag_mappings](../database/tags/tag_mappings.md) table with the following values:  
user_id = request.user.id  
file_id = (created_file / found_file).id  
all tags = sourceId  

### AC 8

For each record in the [devices](../database/users/devices.md) table fulfilling following filter:  
user_id = request.user.id  
  
Create a record in the [file_synchronization](../database/files/file_synchronization.md) table with the following values:  
device_id = record.id  
user_file_id = created_user_file.id  

# Tag parsing  

The client can request the server to create and parse tags via POST /up-vibe/v1/files/{fileId}/tags request. The client has to pass a request with the related file id as a url parameter.

The server should:

#### AC 1

Try to find a record in the [tags](../database/tags/tags.md) table by the following filter:  
file_id = request.url.file_id  
is_primary = true  

Does the record exist?  
- yes - continue  
- no - abort the operation and send the "Primary tag is not found" message  

#### AC 2

Check the status of the found primary tag.

If a status is:
- "С" - continue  
- "E" - abort the operation and send "Primary tag parsing failed" message  
- otherwise abort the operation and send "Primary tag parsing in progress" message

#### AC 3

Create records in the [tags](../database/tags/tags.md) table with the following values:  
file_id = request.url.file_id  
source = [all sources with record.allow_for_secondary_tag_parsing = true]  
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

# File receiving  

The client can request the tagged file from the server using GET /up-vibe/v1/files/{fileId}/download request. The client has to pass a request with the related file id as a url parameter.

The server should:

#### AC 1

Try to find a record in the [files](../database/files/files.md) table by the following filter:  
file_id = request.url.file_id  

Does the record exist?  
- yes - go to AC 2  
- no - abort the operation and send the "File does not exist" (errorCode 1) error response to the user  

#### AC 2

Check the status of the found file.

If a status is:
- "С" - go to AC 3
- "E" - abort the operation and send the "File preparation failed" (errorCode 2) error response to the user   
- otherwise - abort the operation and send the "File is not prepared yet" (errorCode 3) error response to the user

#### AC 3
Try to find a record in the [tag_mappings](../database/tags/tag_mappings.md) table by the following filter:  
file_id = request.url.file_id
user_id = request.user.id   

Does the record exist?  
- yes - go to AC 4  
- no - abort the operation and send the "Tag mapping does not exist" (errorCode 4) error response to the user  

#### AC 4

Find all required tag records in the [tags](../database/tags/tags.md) table by the following filter:  
file_id = request.url.file_id  
source = [all sources that required by the mapping]

#### AC 5

Create a tag object by combining all the tag data from the previous step and request tag file tagging via its file tagger plugin.  
Value mapping for the request:  
tag = [created_tag]
file = [file.uuid]  

Does the plugin report an error?  
- yes - abort the operation and send the error response to the user (errorCode -1)  
- no - send a file to the user
