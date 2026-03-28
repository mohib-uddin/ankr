import { z } from 'zod';
import { normalizePhoneForApi } from '@/features/onboarding/utils/phone-normalize';

/** Step 1 fields — used with `safeParse` before advancing (Zustand remains source of truth). */
export const onboardingBasicStepSchema = z.object({
  fullName: z.string().trim().min(1, 'Please enter your full legal name.'),
  primaryAddress: z.string().trim().min(1, 'Please enter your primary address.'),
  ssn: z.string().trim().min(1, 'Please enter your SSN or tax ID.'),
  phone: z
    .string()
    .trim()
    .refine((v) => normalizePhoneForApi(v) != null, {
      message: 'Enter a valid mobile phone number (US numbers can be 10 digits).',
    }),
});

export type OnboardingBasicStepValues = z.infer<typeof onboardingBasicStepSchema>;
