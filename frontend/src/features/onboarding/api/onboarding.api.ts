import { api } from '@/shared/utils/axios';
import type { ApiMessageData, AuthUser } from '@/features/auth/types/auth.types';
import type { CompleteInvestorOnboardRequest } from '@/features/onboarding/types/onboarding-api.types';

export async function postInvestorOnboard(body: CompleteInvestorOnboardRequest) {
  const { data } = await api.post<ApiMessageData<AuthUser>>('/profile/investor/onboard', body);
  return data;
}
