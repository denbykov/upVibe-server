abstract class ServerAgent {
  public abstract requestFileTagging: (id: string) => Promise<void>;
}

export { ServerAgent };
