import sys
import base64
import json
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC, TIT2, TPE1, TALB, TYER, TRCK
from mutagen.id3 import ID3NoHeaderError

import io

def copy_file_to_memory(file_path):
  with open(file_path, 'rb') as file:
    file_content = file.read()

  in_memory_file = io.BytesIO(file_content)

  return in_memory_file

def apply_tags(mp3_path, tags, output_path):
    file = copy_file_to_memory(mp3_path)

    try:
      audio = MP3(file, ID3=ID3)
    except ID3NoHeaderError:
      audio = MP3(file, ID3=ID3)
      audio.add_tags()

    id3_tags = audio.tags

    if 'title' in tags and tags['title'] != None:
      id3_tags.add(TIT2(encoding=3, text=tags['title']))
    if 'artist' in tags and tags['artist'] != None:
      id3_tags.add(TPE1(encoding=3, text=tags['artist']))
    if 'album' in tags and tags['album'] != None:
      id3_tags.add(TALB(encoding=3, text=tags['album']))
    if 'year' in tags and tags['year'] != None:
      id3_tags.add(TYER(encoding=3, text=str(tags['year'])))
    if 'number' in tags and tags['number'] != None:
      id3_tags.add(TRCK(encoding=3, text=str(tags['number'])))
    if 'image_path' in tags and tags['image_path'] != None:
      with open(tags['image_path'], 'rb') as img_file:
        image_data = img_file.read()
        id3_tags.add(APIC(
            encoding=3,
            mime='image/jpeg',
            type=3,
            desc=u'Cover',
            data=image_data
        ))

    chunk_size = 1024

    audio.save(file)
    file.seek(0)

    with open(output_path, 'wb') as ouput:
      while True:
        chunk = file.read(chunk_size)
        if not chunk:
          break
        ouput.write(chunk)

if __name__ == "__main__":
    if len(sys.argv) < 3:
      print("Usage: python script.py <mp3_path> <json_tags>")
      sys.exit(3)

    mp3_path = sys.argv[1]
    decoded_json_bytes = base64.b64decode(sys.argv[2])
    decoded_json_string = decoded_json_bytes.decode('utf-8')
    output_path = sys.argv[3]

    try:
      tags = json.loads(decoded_json_string)
    except json.JSONDecodeError:
      print("Invalid JSON format for tags.")
      sys.exit(2)

    apply_tags(mp3_path, tags, output_path)
    sys.exit(0)
