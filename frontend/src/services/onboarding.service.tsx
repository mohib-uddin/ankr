import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as onboardingApi from '@/features/onboarding/api/onboarding.api';
import type { CompleteInvestorOnboardRequest } from '@/features/onboarding/types/onboarding-api.types';
import { useSessionStore } from '@/store/session.store';
import type { AuthUser } from '@/features/auth/types/auth.types';

const currentUserQueryKey = ['auth', 'current-user'] as const;

export function useInvestorOnboardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CompleteInvestorOnboardRequest) => onboardingApi.postInvestorOnboard(body),
    retry: false,
    onSuccess: (response) => {
      const user = response.data as AuthUser;
      const token = useSessionStore.getState().accessToken;
      if (token) {
        useSessionStore.getState().setSession(token, user);
      }
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}
