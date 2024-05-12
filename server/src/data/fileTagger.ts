import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 } from 'uuid';

import { ShortTagDTO } from '@src/dtos/shortTagDTO';
import { iFileTagger } from '@src/interfaces/iFileTagger';

const execAsync = promisify(exec);

function readFileIntoBuffer(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function removeFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function executeShellScript(
  script: string,
  args: Array<string>
): Promise<void> {
  try {
    console.log(`Executing script: ${script} ${args.join(' ')}`);
    const { stderr } = await execAsync(`${script} ${args.join(' ')}`);
    if (stderr) {
      throw new Error(`Script returned an error: ${stderr}`);
    }
  } catch (error) {
    throw new Error(`Error executing script: ${error}`);
  }
}

export class FileTagger implements iFileTagger {
  storagePath: string;

  constructor(storagePath: string) {
    this.storagePath = storagePath;
  }

  public tagFile = async (
    filename: string,
    tags: ShortTagDTO
  ): Promise<Buffer> => {
    const filePath = path.join(this.storagePath, 'music', `${filename}.mp3`);

    const tagsObject = {
      title: tags.title,
      artist: tags.artist,
      album: tags.album,
      year: tags.year,
      number: tags.trackNumber,
      image_path: tags.picturePath,
    };

    const replaceQuotes = (str: string) => {
      return str.replaceAll('"', '\\"');
    };

    const script =
      '. /opt/upVibe/venv/bin/activate && python3 /opt/upVibe/scripts/taggers/mp3-tagger.py';
    const tmpFilePath = path.join('/tmp', `${v4()}.mp3`);

    await executeShellScript(script, [
      filePath,
      `"${replaceQuotes(JSON.stringify(tagsObject))}"`,
      tmpFilePath,
    ]);

    const result = await readFileIntoBuffer(tmpFilePath);

    await removeFile(tmpFilePath);

    return result;
  };
}
