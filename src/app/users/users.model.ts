import { UserRole } from '../_helpers/auth.model';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDto {
  name: string;
  email?: string;
  password?: string;
  role: UserRole;
}
