import { User } from '../users/users.model';

export interface Material {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CreateMaterialDto {
  name: string;
  imageUrl: string;
}

export interface MaterialReservation {
  id: string;
  name: string;
  startTimestamp: number;
  endTimestamp: number;
  status: number;
  amount: number;
  user: User;
  material: Material;
}

export enum MaterialReservationStatus {
  REQUESTED = 0,
  CANCELLED = 1,
  ACCEPTED = 2,
  DENIED = 3,
  ISSUED = 4,
  RETURNED = 5
}
