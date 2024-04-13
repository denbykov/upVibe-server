interface DataMapper<D, E> {
  toEntity(dto: D): E;
  toDTO?(entity: E): D;
}

export { DataMapper };
