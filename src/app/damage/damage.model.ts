import { User } from '../reservations/reservations.model';

export interface Damage {
  id: string;
  boatId: string;
  description: string;
  createdAt: string;
  resolvedAt: Date;
  createdByUser: User;
  lastUpdatedByUser: User;
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
