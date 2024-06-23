export abstract class iPlaylistPlugin {
  pluginName!: string;
  public abstract parsePlaylist: (
    playlistId: string,
    sourceName: string
  ) => Promise<void>;
}
