# File management

This document describes file management details, such as file downloading, synchronization, and tagging.

# Content

- [Plugins](#plugins)
- [Downloading](#downloading)
- [Tag parsing](#tag-parsing)
- [Tag mappings](#tag-mappings)
- [File receiving](#file-receiving)

# File coordinator worker

The file coordinator worker is a separate program from the server, that is responsible for setting completed status for the file. It is accessible to other services via following API:
```json
routing-key: checking/file
body:
{
    "file_id": "1"
}
``` 

On message it should:

#### AC 1

Find the file by given id  

#### AC 1.1

check whether its status is 'D'?  
- yes - set its status to 'C'  
- no - continue  

#### AC 1.2

Check whether its status is 'C'?  
- yes - continue  
- no - finish message processing  

#### AC 2

Fetch all <b>tags</b> for current file. 

There are no tags?
- yes - finish message processing  
- no - continue  

#### AC 2.1

There is only one tag?  
- yes - go to AC 2.1.1  
- no - go to AC 2.2.1  

#### AC 2.1.1

Is tag status 'C'?  
- yes - continue  
- no - finish message processing  

#### AC 2.1.2

Request tag parsing via the /up-vibe/v1/files/{fileId}/parse-tags API and finish message processing  

#### AC 2.2.1

Are all tag statuses either 'C' or 'E'?  
- yes - continue  
- no - finish message processing  

#### AC 3

Fetch all records (<b>mappings</b> later) from [tag_mappings](../database/tags/tag_mappings.md) where:  
file_id = request.file_id  
fixed = FALSE  

#### AC 4

For each record in <b>mappings</b> perform AC 5

#### AC 5

Get <b>pirorities</b> from the [tag_mapping_priorities](../database/tags/tag_mapping_priorities.md) table where:  
user_id = <b>mapping</b>.user_id  

#### AC 5.1

Form tag_mapping using <b>tags</b> and <b>pirorities</b>, set fixed to TRUE and update it in the database.

#### AC 5.2

Get <b>user_file</b> record from [user_files](../database/files/user_files.md) table where:  
user_id = <b>mapping</b>.user_id  
file_id = request.file_id  

#### AC 5.3

Update the [file_synchronization](../database/files/file_synchronization.md) table with:  
is_synchronized = FALSE  
server_ts = current timestamp    
where:  
user_file_id = <b>user_file</b>.id  

#### AC 5.4

Update the file status to done  

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

# File deletion  

The client can request the server to delete a file via DELETE /up-vibe/v1/files/{fileId} request. 

### AC 1

Find a record in the [user_files](../database/files/user_files.md) where:  
file_id = request.url.id  
user_id = request.user.id  

Does a record exist?
- yes - continues
- no - abort the operation and send the "File does not exist" error response to the user  

### AC 2

Update the [file_synchronization](../database/files/file_synchronization.md) table with:  
is_synchronized = FALSE  
marked_for_deletion = TRUE  
server_ts = current timestamp  
where:  
user_file_id = <b>user_file</b>.id  

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

# Custom tags  

The client can request the server to add custom tags for file via POST /up-vibe/v1/files/{fileId}/custom-tags request.

The server should:

#### AC 1

Try to find a record in the [user_files](../database/files/user_files.md) table where:  
file_id = request.url.file_id  
user_id = request.user.id   

Does the record exist?  
- yes - continue  
- no - abort the operation and send the "No such file" message  

#### AC 2

Create or update record in the [tags](../database/tags/tags.md) table with:
file_id = request.url.file_id
title = request.body.title  
artist = request.body.artist  
album = request.body.album  
year = request.body.year  
trackNumber = request.body.trackNumber  
user_id = request.user.id  

where:  
file_id = request.url.file_id
user_id = request.user.id  

# Custom picture tag  

The client can request the server to add custom tags for file via POST /up-vibe/v1/files/{fileId}/custom-tags/picture request.

The server should:

#### AC 1

Try to find a record in the [tags](../database/tags/tags.md) table where:  
file_id = request.url.file_id  
user_id = request.user.id   

Does the record exist?  
- yes - continue  
- no - abort the operation and send the "No such tag" message

#### AC 2

Save file to default picture location and update record in the [tags](../database/tags/tags.md) table with:
picture_path = path  

where:  
file_id = request.url.file_id
user_id = request.user.id  

# Tag mappings  

Tag mappings contain information about which exact tags should be applied to the file. They are unique for each user.  

On tag mapping update server should:  

#### AC 1

Set tag_mapping fixed to TRUE together with rest of the fields.

#### AC 2

Get <b>user_file</b> records from [user_files](../database/files/user_files.md) table where:  
user_id = tag_mapping.user_id  
file_id = tag_mapping.file_id  

#### AC 3

For each <b>user_file</b> record perform AC 4  

#### AC 4

Update the [file_synchronization](../database/files/file_synchronization.md) table with:  
is_synchronized = FALSE  
server_ts = current timestamp  
where:  
user_file_id = <b>user_file</b>.id  

## Tag mapping priorities

As all sources provide tags of different quality, it is natural to choose tags from the finest sources first, then from less formidable ones, and so on. Tag mapping priorities are a simple way to automate this.  

Default priority for each user is configurable, using following format:  
```json
{
  "title": [
    0
  ],
  "artist": [
    0
  ],
  "album": [
    0
  ],
  "year": [
    0
  ],
  "trackNumber": [
    0
  ],
  "picture": [
    0
  ]
}
```  
Each item in the arrays is a source id. Its priority is defined by the position in the array; for example, the item on index 0 has the highest priority, and so on.

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
- otherwise - abort the operation and send the "File is not ready yet" (errorCode 3) error response to the user

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

Create a tag object by combining all the tag data from the previous step and tag file. 
Value mapping for the request:  
tag = [created_tag]
file = [file.uuid]  

Does the plugin report an error?  
- yes - abort the operation and send the error response to the user (errorCode -1)  
- no - send a file to the user

# File confirmation  

The client must confirm file downloading or deletion using POST /up-vibe/v1/files/{fileId}/confirm request

The server should:

#### AC 1

Get <b>user_file</b> record from [user_files](../database/files/user_files.md) table where:  
user_id = request.token.user_id  
file_id = request.url.file_id  

#### AC 2

Find a [file_synchronization](../database/files/file_synchronization.md) record where:  
device_id = request.url.deviceId  
user_file_id = <b>user_file</b>.id  

If <b>file_synchronization</b>.marked_for_deletion is:  
- false - go to AC 3
- true - go to AC 4

#### AC 3

Update the [file_synchronization](../database/files/file_synchronization.md) table with:  
is_synchronized = TRUE  
device_ts = current timestamp  
where:  
device_id = request.url.deviceId  
user_file_id = <b>user_file</b>.id  

finalize processing

#### AC 4

Delete record from the [file_synchronization](../database/files/file_synchronization.md) table where:    
where:  
device_id = request.url.deviceId  
user_file_id = <b>user_file</b>.id  

#### AC 5

Find a [file_synchronization](../database/files/file_synchronization.md) records where:  
user_file_id = <b>user_file</b>.id  

Any records found?
- yes - finalize processing
- no - go to AC 6

#### AC 6

Find records in the [user_files](../database/files/user_files.md) table where:  
file_id = request.url.file_id  

Any records found?
- yes - finalize processing
- no - go to AC 7

#### AC 7

Delete file and all records refering it where file id = request.url.file_id  