import { Source } from './source';
import { TagMapping } from './tagMapping';
import { ShortTags } from './taggedFile';

class TaggedMapping {
  public id: number;
  public source: Source;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTags | null;
  public mapping: TagMapping;

  constructor(
    id: number,
    source: Source,
    status: string,
    sourceUrl: string,
    tags: ShortTags | null,
    mapping: TagMapping
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
    this.mapping = mapping;
  }
}

export { TaggedMapping };
