/** Mirrors backend `User` entity fields returned on auth (password excluded). */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
  picture?: string | null;
  roleId?: string | null;
  role?: {
    id: string;
    key?: string;
    name?: string;
  } | null;
  profile?: unknown;
}

export interface AuthCredentialsPayload {
  user: AuthUser;
  access_token: string;
}

export interface ApiMessage {
  message: string;
}

export interface ApiMessageData<T> extends ApiMessage {
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
