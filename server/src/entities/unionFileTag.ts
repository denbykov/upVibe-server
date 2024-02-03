import { File } from './file';
import { Tag } from './tag';

export class UnionFileTag {
  public file: File;
  public tag: Tag;
  constructor(file: File, tag: Tag) {
    this.file = file;
    this.tag = tag;
  }

  public static fromJSON = (json: JSON.JSONObject): UnionFileTag => {
    return new UnionFileTag(File.fromJSON(json.file), Tag.fromJSON(json.tag));
  };

  public toJSON = (): JSON.JSONObject => {
    return {
      file: this.file.toJSON(),
      tag: this.tag.toJSON(),
    };
  };
}
