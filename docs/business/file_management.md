# File management

This document describes file management details, such as file downloading, synchronization, and tagging.

# Content

- [Plugins](#plugins)
- [Downloading](#downloading)
- [Tagging](#tagging)

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
source_url = request.url  

Does the record exist?
- yes - abort the operation and send the error response to the user
- no - go to AC 2

#### AC 2

Generate the unique universal id for the requested file and try to create a new record in the [files](../database/files/files.md) table with the following values:  
path = UUID  
source_url = request.url  
status = "CR"  

#### AC 3

Does the file creation fail because the UUID is taken?
- yes - go to AC 1
- no - go to AC 3

#### AC 4

Request file downloading via its downloader plugin.
Value mapping for the request:  
file_id = created_file.id  
url = request.url  
uuid = UUID  

Does the plugin report an error?
- yes - abort the operation and send the error response to the user
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
url = request.url  

Does the plugin report an error?
- yes - abort the operation and send the error response to the user
- no - send a successful response to the user