import { Boat } from '../boats/boats.model';

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

export interface User {
  name: string;
  email: string;
  id: string;
  role: number;
}
