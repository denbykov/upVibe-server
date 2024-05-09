class TagMappingPriorityDTO {
  public userId: string;
  public source: string[];
  public title: string[];
  public artist: string[];
  public album: string[];
  public picture: string[];
  public year: string[];
  public trackNumber: string[];

  constructor(
    userId: string,
    source: string[],
    title: string[],
    artist: string[],
    album: string[],
    picture: string[],
    year: string[],
    trackNumber: string[],
  ) {
    this.userId = userId;
    this.source = source;
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.picture = picture;
    this.year = year;
    this.trackNumber = trackNumber;
  }

  public static fromJSON(jsons: JSON.JSONObject[]): TagMappingPriorityDTO {
    jsons.sort((a, b) => {
      return a.tag_mapping_priority_source - b.tag_mapping_priority_source;
    });

    return new TagMappingPriorityDTO(
      jsons[0].tag_mapping_priority_user_id.toString(),
      jsons.map((json) => json.tag_mapping_priority_source.toString()),
      jsons.map((json) => json.tag_mapping_priority_title.toString()),
      jsons.map((json) => json.tag_mapping_priority_artist.toString()),
      jsons.map((json) => json.tag_mapping_priority_album.toString()),
      jsons.map((json) => json.tag_mapping_priority_picture.toString()),
      jsons.map((json) => json.tag_mapping_priority_year.toString()),
      jsons.map((json) => json.tag_mapping_priority_track_number.toString()),
    );
  }
}

export { TagMappingPriorityDTO };
