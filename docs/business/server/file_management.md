# File management

This document describes file management details, such as file downloading, synchronization, and tagging for server.

# Content

- [Plugins](#plugins)
- [Downloading](#downloading)
- [File deletion](#file-deletion)
- [Custom tags](#custom-tags)
- [Custom picture tag](#custom-picture-tag)
- [Tag mappings](#tag-mappings)
- [Tag mapping priorities](#tag-mapping-priorities)
- [File receiving](#file-receiving)
- [File confirmation](#file-confirmation)
- [Add playlist](#add-playlist)

# Downloading  

The client can request the server to download a file via POST /up-vibe/v1/files request. The client has to pass a request with the following JSON structure in the body:
```json
{
    "url": "some/url"
}
```

The server should:

#### AC 1

Via the filePlugin perform request.body.url normalization and get sourceId  
normalizedUrl = normalize request.body.url  
sourceId = get source id for request.body.url  

#### AC 2

Try to find a record in the [user_files](../../database/files/user_files.md) table by the following filter:  
file_id =  
&emsp; id from [files](../../database/files/files.md) where:  
&emsp; source_url = normalizedUrl  
user_id = request.body.user.id  

Does the record exist?
- yes - abort with "File alreay exists"
- no - continue

#### AC 3

Request file donwloading  
routing-key: /downloading/file
url = request.body.url  
user_id = request.body.user.id  
playlist_id = 1 (DEFAULT playlist)  

# File deletion  

The client can request the server to delete a file via DELETE /up-vibe/v1/files/{fileId} request. 

### AC 1

Find a record in the [user_files](../../database/files/user_files.md) where:  
file_id = request.url.id  
user_id = request.user.id  

Does a record exist?
- yes - continues
- no - abort the operation and send the "File does not exist" error response to the user  

### AC 2

Remove records from the [user_playlist_files](../../database/files/user_paylist_files.md) for given request.url.playlists where:  
file_id = request.url.id  
user_playlist_id = any(  
&emsp; id from [user_playlists](../../database/files/user_platlists.md) where:  
&emsp; playlist_id = any(request.url.playlist_id)  
&emsp; user_id = any(request.body.user_id)  
)  

### AC 3

Update the [file_synchronization](../../database/files/file_synchronization.md) table with:  
is_synchronized = FALSE  
server_ts = current timestamp  
where:  
user_file_id = <b>user_file</b>.id  

# Custom tags  

The client can request the server to add custom tags for file via POST /up-vibe/v1/files/{fileId}/custom-tags request.

The server should:

#### AC 1

Try to find a record in the [user_files](../../database/files/user_files.md) table where:  
file_id = request.url.file_id  
user_id = request.user.id   

Does the record exist?  
- yes - continue  
- no - abort the operation and send the "No such file" message  

#### AC 2

Create or update record in the [tags](../../database/tags/tags.md) table with:
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

Try to find a record in the [tags](../../database/tags/tags.md) table where:  
file_id = request.url.file_id  
user_id = request.user.id   

Does the record exist?  
- yes - continue  
- no - abort the operation and send the "No such tag" message

#### AC 2

Save file to default picture location and update record in the [tags](../../database/tags/tags.md) table with:
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

Get <b>user_file</b> records from [user_files](../../database/files/user_files.md) table where:  
user_id = tag_mapping.user_id  
file_id = tag_mapping.file_id  

#### AC 3

For each <b>user_file</b> record perform AC 4  

#### AC 4

Update the [file_synchronization](../../database/files/file_synchronization.md) table with:  
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

Try to find a record in the [files](../../database/files/files.md) table by the following filter:  
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
Try to find a record in the [tag_mappings](../../database/tags/tag_mappings.md) table by the following filter:  
file_id = request.url.file_id
user_id = request.user.id   

Does the record exist?  
- yes - go to AC 4  
- no - abort the operation and send the "Tag mapping does not exist" (errorCode 4) error response to the user  

#### AC 4

Find all required tag records in the [tags](../../database/tags/tags.md) table by the following filter:  
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

#### AC 1.1

Get <b>user_file</b> record from [user_files](../../database/files/user_files.md) table where:  
user_id = request.token.user_id  
file_id = request.url.file_id  

#### AC 1.2

Find a [file_synchronization](../../database/files/file_synchronization.md) record where:  
device_id = request.url.deviceId  
user_file_id = <b>user_file</b>.id  

### AC 1.3

Find records in the [user_playlist_files](../../database/files/user_paylist_files.md) where:  
file_id = request.url.id    
user_id = request.body.user_id    

Are any records found?
- yes - go to AC 2  
- no - go to AC 3  

#### AC 2

Update the [file_synchronization](../../database/files/file_synchronization.md) table with:  
is_synchronized = TRUE  
device_ts = current timestamp  
where:  
device_id = request.url.deviceId  
user_file_id = <b>user_file</b>.id  

finalize processing

#### AC 3.1

Delete record from the [file_synchronization](../../database/files/file_synchronization.md) table where:    
where:  
device_id = request.url.deviceId  
user_file_id = <b>user_file</b>.id  

#### AC 3.2

Find a record in the [file_synchronization](../../database/files/file_synchronization.md) table where:    
where:  
user_file_id = <b>user_file</b>.id  

Are any records found?

- yes - finalize processing  
- no - go to AC 4  

#### AC 4.1

Delete record from the [user_files](../../database/files/user_files.md) table where:    
where:  
user_id = request.body.user_id  
user_file_id = <b>user_file</b>.id  

#### AC 4.2

Find records in the [user_files](../../database/files/user_files.md) table where:  
file_id = request.url.file_id  

Are any records found?
- yes - finalize processing
- no - go to AC 5

#### AC 5

Delete file and all records refering it where file id = request.url.file_id from the database and from the fyle system.  

# Add playlist  

The client can request the server to add a playlist via POST /up-vibe/v1/playlists request. The client has to pass a request with the following JSON structure in the body:
```json
{
    "url": "some/url"
}
```

The server should:

#### AC 1

Via the filePlugin perform request.body.url normalization and get sourceId  
normalizedUrl = normalize request.body.url  
sourceId = get source id for request.body.url  

#### AC 2

Try to find a record in the [playlists](../../database/files/playlists.md) table by the following filter:  
source_url = normalizedUrl  

Does the record exist?
- yes - go to AC 3
- no - go to AC 4

#### AC 3

Try to find a record in the [user_playlists](../../database/files/user_playlists.md) table by the following filter:  
user_id = request.body.user.id
file  

Does the record exist?
- yes - abort the operation and send the "Playlist already added" error  
- no - go to AC 4

#### AC 4

Request playlist creation  
routing-key: /add/playlist
url = request.body.url  
user_id = request.body.user.id
