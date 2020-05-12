import { Boat } from '../boats/boats.model';
import { User } from '../users/users.model';

export interface Reservation {
  id: string;
  skipper?: string;
  boat: Boat;
  user: User;
  startTimestamp: number;
  endTimestamp: number;
  accepted?: boolean;
  finished: boolean;
}

export interface AcceptanceDto {
  status: boolean;
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc'
}
