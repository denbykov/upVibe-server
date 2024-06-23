import { Source } from './source';

class Playlist {
  constructor(
    public readonly id: string,
    public readonly source: Source,
    public readonly sourceUrl: string,
    public readonly addedTs: Date,
    public readonly status: string,
    public readonly synchronizationTs: boolean,
    public readonly title: string
  ) {}
}

export { Playlist };
