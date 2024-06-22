# File management

This document describes file management details, such as file downloading, synchronization, and tagging for file coordinator worker.

# Content

- [File checking](#file-checking)
- [Tag parsing](#tag-parsing)

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
