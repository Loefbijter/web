export interface Tokens {
  bearerToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  bearerToken: string;
}

export interface DecodedToken {
  type: string;
  uid: string;
  role: number;
  iat: number;
  exp: number;
}

export enum UserRole {
  ADMIN = 1,
  BOARD = 2,
  COMMITTEE = 3,
  MEMBER = 4
}
