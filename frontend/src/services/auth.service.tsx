import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authApi from '@/features/auth/api/auth.api';
import { useSessionStore } from '@/store/session.store';
import type { LoginRequest, SignupRequest } from '@/features/auth/types/auth.types';

const currentUserQueryKey = ['auth', 'current-user'] as const;

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body),
    onSuccess: (response) => {
      const { access_token, user } = response.data;
      useSessionStore.getState().setSession(access_token, user);
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SignupRequest) => authApi.signup(body),
    onSuccess: (response) => {
      const { access_token, user } = response.data;
      useSessionStore.getState().setSession(access_token, user);
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}

export function useCurrentUserQuery(enabled = true) {
  const isAuthenticated = useSessionStore((s) => Boolean(s.accessToken));

  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => authApi.getCurrentUser(),
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    useSessionStore.getState().clearSession();
    queryClient.removeQueries({ queryKey: currentUserQueryKey });
    queryClient.clear();
  };
}
