import axios, { type AxiosError } from 'axios';
import { useSessionStore } from '@/store/session.store';
import { queryClient } from '@/app/query-client';

function resolveApiBaseURL() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return '/api';
  return 'http://localhost:5000/api';
}

const baseURL = resolveApiBaseURL();

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = useSessionStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      const hadSession = Boolean(useSessionStore.getState().accessToken);
      if (hadSession) {
        useSessionStore.getState().clearSession();
        queryClient.clear();
        const path = window.location.pathname;
        if (
          path !== '/login' &&
          path !== '/signup' &&
          path !== '/forgot-password' &&
          path !== '/reset-password'
        ) {
          window.location.assign(`/login?session=expired`);
        }
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message !== undefined) {
      return Array.isArray(data.message) ? data.message[0] ?? 'Request failed' : data.message;
    }
    if (error.message) return error.message;
  }
  return 'Something went wrong. Please try again.';
}
