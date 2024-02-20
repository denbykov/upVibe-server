type MappingFile = Record<
  string,
  | string
  | number
  | Record<string, string | number>
  | Array<Record<string, string | number>>
> | null;

type MappingFiles = Array<MappingFile> | null;

export { MappingFile, MappingFiles };
