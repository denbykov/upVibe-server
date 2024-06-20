export abstract class PlaylistDatabase {
  public abstract insertUserPaylistFiles(
    playlistId: string,
    fileId: string,
  ): Promise<void>;
}
