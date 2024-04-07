import { TaggedMapping } from '@src/entities/taggedMapping';

import { SourceDTO } from './sourceDTO';
import { TagMappingDTO } from './tagMappingDTO';
import { ShortTagsDTO } from './taggedFileDTO';

class TaggedMappingDTO {
  public id: number;
  public source: SourceDTO;
  public status: string;
  public sourceUrl: string;
  public tags: ShortTagsDTO | null;
  public mapping: TagMappingDTO;

  constructor(
    id: number,
    source: SourceDTO,
    status: string,
    sourceUrl: string,
    tags: ShortTagsDTO | null,
    mapping: TagMappingDTO
  ) {
    this.id = id;
    this.source = source;
    this.status = status;
    this.sourceUrl = sourceUrl;
    this.tags = tags;
    this.mapping = mapping;
  }

  public static fromJSON = (json: JSON.JSONObject): TaggedMappingDTO => {
    const shortTags = ShortTagsDTO.fromJSON(json);
    const fileMapping = TagMappingDTO.fromJSON(json);
    return new TaggedMappingDTO(
      json.file_id,
      SourceDTO.fromJSON(json),
      json.file_status,
      json.file_source_url,
      shortTags.empty() ? null : shortTags,
      fileMapping
    );
  };

  public toEntity = (): TaggedMapping => {
    return new TaggedMapping(
      this.id,
      this.source.toEntity(),
      this.status,
      this.sourceUrl,
      this.tags ? this.tags.toEntity() : null,
      this.mapping.toEntity()
    );
  };
}

export { TaggedMappingDTO };
