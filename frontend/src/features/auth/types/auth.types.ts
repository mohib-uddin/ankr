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
  /** `null` until the user completes profile / onboarding on the backend. */
  profile?: unknown | null;
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateForgotPasswordCodeRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordChangeRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

/** Backend `EmailVerificationDto`: 5-digit numeric `code` from `generateCode`. */
export interface EmailVerificationRequest {
  email: string;
  code: string;
}

export interface ResendVerificationCodeRequest {
  email: string;
}
