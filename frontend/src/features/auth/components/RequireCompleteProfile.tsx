import { Navigate, Outlet } from 'react-router';
import { useSessionStore } from '@/store/session.store';
import { needsProfileSetup } from '@/features/auth/utils/post-auth-redirect';

/**
 * Blocks the main app shell (dashboard) until the user has a profile from the API.
 * Onboarding and profile-setup routes stay outside this layout.
 */
export function RequireCompleteProfile() {
  const user = useSessionStore((s) => s.user);

  if (user != null && needsProfileSetup(user)) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}
