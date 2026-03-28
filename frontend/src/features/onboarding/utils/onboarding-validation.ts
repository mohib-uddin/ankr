import type { OnboardingDraftState } from '@/store/onboarding.store';
import { onboardingBasicStepSchema } from '@/features/onboarding/schemas/onboarding-basic-step.schema';

export type BasicInfoValidatedFieldKey = 'fullName' | 'primaryAddress' | 'phone' | 'ssn';

/** Per-field messages for step 1 (Zod flatten). Email is not validated on this step. */
export function getBasicInfoStepFieldErrors(
  basicInfo: OnboardingDraftState['basicInfo'],
): Partial<Record<BasicInfoValidatedFieldKey, string>> {
  const r = onboardingBasicStepSchema.safeParse(basicInfo);
  if (r.success) return {};
  const f = r.error.flatten().fieldErrors;
  const out: Partial<Record<BasicInfoValidatedFieldKey, string>> = {};
  const pick = (k: BasicInfoValidatedFieldKey) => {
    const msg = f[k]?.[0];
    if (msg) out[k] = msg;
  };
  pick('fullName');
  pick('primaryAddress');
  pick('phone');
  pick('ssn');
  return out;
}
