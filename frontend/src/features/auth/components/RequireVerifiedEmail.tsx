import { Navigate, Outlet } from 'react-router';
import { useSessionStore } from '@/store/session.store';
import { needsEmailVerification, VERIFY_EMAIL_PATH } from '@/features/auth/utils/post-auth-redirect';

/**
 * Ensures email is verified before profile setup, onboarding, or the main app shell.
 * `/verify-email` is a sibling route under {@link RequireAuth}, not wrapped here.
 */
export function RequireVerifiedEmail() {
  const user = useSessionStore((s) => s.user);

  if (user != null && needsEmailVerification(user)) {
    return <Navigate to={VERIFY_EMAIL_PATH} replace />;
  }

  return <Outlet />;
}
