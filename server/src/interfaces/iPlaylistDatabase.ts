export abstract class iPlaylistDatabase {
  public abstract insertUserPaylistFiles(
    playlistId: string,
    fileId: string
  ): Promise<void>;
  public abstract getDefaultUserPlaylistId(userId: string): Promise<string>;
}
