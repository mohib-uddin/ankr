import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authApi from '@/features/auth/api/auth.api';
import { useSessionStore } from '@/store/session.store';
import { clearOnboardingDraft } from '@/store/onboarding.store';
import type {
  EmailVerificationRequest,
  ForgotPasswordChangeRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResendVerificationCodeRequest,
  SignupRequest,
  ValidateForgotPasswordCodeRequest,
} from '@/features/auth/types/auth.types';

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
    clearOnboardingDraft();
    useSessionStore.getState().clearSession();
    queryClient.removeQueries({ queryKey: currentUserQueryKey });
    queryClient.clear();
  };
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (body: ForgotPasswordRequest) => authApi.forgotPassword(body),
  });
}

export function useValidateForgotPasswordCodeMutation() {
  return useMutation({
    mutationFn: (body: ValidateForgotPasswordCodeRequest) => authApi.validateForgotPasswordCode(body),
  });
}

export function useForgotPasswordChangeMutation() {
  return useMutation({
    mutationFn: (body: ForgotPasswordChangeRequest) => authApi.forgotPasswordChange(body),
  });
}

export function useVerifyEmailMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: EmailVerificationRequest) => authApi.verifyEmail(body),
    onSuccess: (_, variables) => {
      const token = useSessionStore.getState().accessToken;
      const sessionUser = useSessionStore.getState().user;
      if (token && sessionUser && sessionUser.email === variables.email) {
        useSessionStore.getState().setSession(token, { ...sessionUser, isVerified: true });
      }
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}

export function useResendVerificationCodeMutation() {
  return useMutation({
    mutationFn: (body: ResendVerificationCodeRequest) => authApi.resendVerificationCode(body),
  });
}
