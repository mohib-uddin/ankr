import type { AuthUser } from '@/features/auth/types/auth.types';

export const PROFILE_SETUP_PATH = '/profile-setup';

/** True when the API returned no profile (null/undefined) — user must complete profile / onboarding first. */
export function needsProfileSetup(user: AuthUser): boolean {
  return user.profile == null;
}

/**
 * After login/signup (or when bouncing a logged-in user off guest routes), pick the next route.
 * Incomplete profiles always go to profile setup first; otherwise honor `intendedPath`, then dashboard.
 */
export function getPostAuthRedirectPath(user: AuthUser, intendedPath?: string | null): string {
  if (needsProfileSetup(user)) return PROFILE_SETUP_PATH;

  const from = intendedPath?.trim();
  if (
    from &&
    from !== '/login' &&
    from !== '/signup' &&
    from !== PROFILE_SETUP_PATH
  ) {
    return from;
  }

  return '/dashboard';
}
