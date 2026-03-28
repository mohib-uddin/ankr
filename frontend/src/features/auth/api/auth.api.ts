import { api } from '@/shared/utils/axios';
import type {
  ApiMessageData,
  AuthCredentialsPayload,
  AuthUser,
  LoginRequest,
  SignupRequest,
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
