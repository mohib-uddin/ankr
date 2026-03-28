import type { AuthUser } from '@/features/auth/types/auth.types';

export const VERIFY_EMAIL_PATH = '/verify-email';
export const PROFILE_SETUP_PATH = '/profile-setup';

/** Account exists but email not confirmed — must verify before profile setup or the app shell. */
export function needsEmailVerification(user: AuthUser): boolean {
  return !user.isVerified;
}

/** True when the API returned no profile (null/undefined) — user must complete profile / onboarding first. */
export function needsProfileSetup(user: AuthUser): boolean {
  return user.profile == null;
}

/**
 * After login/signup (or when bouncing a logged-in user off guest routes), pick the next route.
 * Unverified users go to email verification first, then profile setup if needed; otherwise honor `intendedPath`, then dashboard.
 */
export function getPostAuthRedirectPath(user: AuthUser, intendedPath?: string | null): string {
  if (needsEmailVerification(user)) return VERIFY_EMAIL_PATH;
  if (needsProfileSetup(user)) return PROFILE_SETUP_PATH;

  const from = intendedPath?.trim();
  if (
    from &&
    from !== '/login' &&
    from !== '/signup' &&
    from !== PROFILE_SETUP_PATH &&
    from !== VERIFY_EMAIL_PATH
  ) {
    return from;
  }

  return '/dashboard';
}
