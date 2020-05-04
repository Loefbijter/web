export interface Damage {
  id: string;
  boatId: string;
  description: string;
  createdAt: string;
  resolvedAt: Date;
}

export interface UpdateDamageDto {
  description: string;
  resolvedAt?: Date;
}

export interface Paged<T> {
  itemCount: number;
  totalItems: number;
  pageCount: number;
  next: string;
  previous: string;
  items: T[];
}
