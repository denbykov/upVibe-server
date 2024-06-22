# File management

This document describes file management details, such as file downloading, synchronization, and tagging for file coordinator worker.

# Content

- [Plugins](#plugins)
- [Downloading](#downloading)
- [File checking](#file-checking)
- [Tag parsing](#tag-parsing)
- [Add playlist](#add-playlist)

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
- Playlist parser  
This plugin is responsible for the communication with playlist parsing workers. For example, the amqp message produced by this plugin should look like one of the following:
```json
routing-key: parsing/playlists/source-name
body:
{
    "playlist_id": 1,
}
```

# Downloading  

This functionality is responsible for the file downloading.

API:
```json
routing-key: /downloading/file
body:
{
    "url": "some/url",
    "user_id": 1,
    "playlist_id": 1
}
```

The system should:

#### AC 1.1

Via the filePlugin perform request.body.url normalization and get sourceId  
normalizedUrl = normalize request.body.url  
sourceId = get source id for request.body.url  

#### AC 1.2

Try to find a record in the [files](../../database/files/files.md) table by the following filter:  
source_url = normalizedUrl  

Does the record exist?
- yes - go to AC 6
- no - go to AC 2

#### AC 2.1

Insert a new record in the [files](../../database/files/files.md) table with the following values:  
path = null  
source_url = normalizedUrl  
status = "CR"  

#### AC 2.2

Insert a new record in the [user_paylist_files](../../database/files/user_paylist_files.md) table with the following values:  
file_id = <b>file</b>.id  
user_playlist_id =   
&emsp; id from [user_playlists](../../database/files/user_playlists.md) where:  
&emsp; user_id = request.body.user_id  
&emsp; playlist_id = request.body.playlist_id  
missing_from_remote = FALSE  

#### AC 3

Request file downloading.  
Value mapping for the request:  
file_id = created_file.id  
url = normalizedUrl  
uuid = created_file.uuid  

#### AC 4

Create a native tag record in the [tags](../../database/tags/tags.md) table with the following values:  
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

Create a record in the [user_files](../../database/files/user_files.md) table with the following values:  
user_id = request.user.id  
file_id = (created_file / found_file).id  

#### AC 7

Create a record in the [tag_mappings](../../database/tags/tag_mappings.md) table with the following values:  
user_id = request.user.id  
file_id = (created_file / found_file).id  
all tags = sourceId  

### AC 8

For each record in the [devices](../../database/users/devices.md) table fulfilling following filter:  
user_id = request.user.id  
  
Create a record in the [file_synchronization](../../database/files/file_synchronization.md) table with the following values:  
device_id = record.id  
user_file_id = created_user_file.id  

# File checking

This functionality ensures that file has the right status and parsing is requested.

API:
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

Check whether its status is 'C' or 'D'?  
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

Perform tag parsing ([Tag parsing](#tag-parsing))

#### AC 2.2.1

Are all tag statuses either 'C' or 'E'?  
- yes - continue  
- no - finish message processing  

#### AC 3

Fetch all records (<b>mappings</b> later) from [tag_mappings](../../database/tags/tag_mappings.md) where:  
file_id = request.file_id  
fixed = FALSE  

#### AC 4

For each record in <b>mappings</b> perform AC 5

#### AC 5

Get <b>pirorities</b> from the [tag_mapping_priorities](../../database/tags/tag_mapping_priorities.md) table where:  
user_id = <b>mapping</b>.user_id  

#### AC 5.1

Form tag_mapping using <b>tags</b> and <b>pirorities</b>, set fixed to TRUE and update it in the database.

#### AC 5.2

Get <b>user_file</b> record from [user_files](../../database/files/user_files.md) table where:  
user_id = <b>mapping</b>.user_id  
file_id = request.file_id  

#### AC 5.3

Update the [file_synchronization](../../database/files/file_synchronization.md) table with:  
is_synchronized = FALSE  
server_ts = current timestamp    
where:  
user_file_id = <b>user_file</b>.id  

#### AC 5.4

check whether its status is 'D'?  
- yes - set its status to 'C'  
- no - continue   

# Tag parsing  

This functionality is responsible for the secondary tag parsing.

The system should:

#### AC 1

Try to find a record in the [tags](../../database/tags/tags.md) table by the following filter:  
file_id = request.file_id  
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

Create records in the [tags](../../database/tags/tags.md) table with the following values:  
file_id = request.file_id  
source = [all sources with record.allow_for_secondary_tag_parsing = true]  
status = "CR"  

#### AC 4

Request tag parsing via the parser plugin.  
Value mapping for the request:  
tag_id = [created_tag.id]  

Insert a new record in the [playlists](../../database/files/playlists.md) table with the following values:    
source_url = normalizedUrl  
source_id = sourceId  
status = "CR"  

# Add playlist  

This functionality is responsible for the playlist creation.

API:
```json
routing-key: /downloading/file
body:
{
    "url": "some/url",
    "user_id": 1
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
- yes - go to AC 5
- no - go to AC 3

#### AC 3

Insert a record in the [playlists](../../database/files/playlists.md) table with following data:    
source_url = normalizedUrl  
source_id = sourceId  
added_ts = now  
status = CR  
synchronization_ts = NULL  

#### AC 4

Request playlist parsing via the playlist parser plugin.  
Value mapping for the request:  
playlist_id = <b>playlist</b>.id  

#### AC 5

Try to insert record to the [user_playlists](../../database/files/user_playlists.md) table with follwing data:  
user_id = request.body.user_id  
playlist_id = <b>playlist</b>.id  
added_ts = NOW()  

Does the record already exist?
- yes - exit with error "User already has a playlist ${playlist.id}"
- no - finalize processing
