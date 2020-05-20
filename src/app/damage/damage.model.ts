import { User } from '../users/users.model';

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
