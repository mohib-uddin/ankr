import { api } from '@/shared/utils/axios';
import type {
  ApiMessage,
  ApiMessageData,
  AuthCredentialsPayload,
  AuthUser,
  EmailVerificationRequest,
  ForgotPasswordChangeRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResendVerificationCodeRequest,
  SignupRequest,
  ValidateForgotPasswordCodeRequest,
} from '@/features/auth/types/auth.types';

export async function login(body: LoginRequest) {
  const { data } = await api.post<ApiMessageData<AuthCredentialsPayload>>('/auth/login', body);
  return data;
}

export async function signup(body: SignupRequest) {
  const { data } = await api.post<ApiMessageData<AuthCredentialsPayload>>('/auth/signup', body);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<ApiMessageData<AuthUser>>('/user');
  return data;
}

export async function forgotPassword(body: ForgotPasswordRequest) {
  const { data } = await api.post<ApiMessage>('/auth/forgot-password', body);
  return data;
}

export async function validateForgotPasswordCode(body: ValidateForgotPasswordCodeRequest) {
  const { data } = await api.post<ApiMessage>('/auth/forgot-password/validate-code', body);
  return data;
}

export async function forgotPasswordChange(body: ForgotPasswordChangeRequest) {
  const { data } = await api.post<ApiMessage>('/auth/forgot-password/change-password', body);
  return data;
}

export async function verifyEmail(body: EmailVerificationRequest) {
  const { data } = await api.post<ApiMessage>('/auth/email-verification', body);
  return data;
}

export async function resendVerificationCode(body: ResendVerificationCodeRequest) {
  const { data } = await api.post<ApiMessage>('/auth/verification-code', body);
  return data;
}
