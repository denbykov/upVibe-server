import { SourceDTO } from './sourceDTO';

class PlaylistDTO {
  constructor(
    public readonly id: string,
    public readonly source: SourceDTO,
    public readonly sourceUrl: string,
    public readonly addedTs: Date,
    public readonly status: string,
    public readonly synchronizationTs: boolean,
    public readonly title: string
  ) {}

  public static fromJSON(json: JSON.JSONObject): PlaylistDTO {
    return new PlaylistDTO(
      json.id,
      SourceDTO.fromJSON(json),
      json.source_url,
      json.added_ts,
      json.status,
      json.synchronization_ts,
      json.title
    );
  }
}

export { PlaylistDTO };
