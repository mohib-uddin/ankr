import { Navigate, Outlet } from 'react-router';
import { useSessionStore } from '@/store/session.store';
import { getPostAuthRedirectPath } from '@/features/auth/utils/post-auth-redirect';

/** Redirects authenticated users away from login/signup (dashboard vs profile setup). */
export function GuestOnly() {
  const token = useSessionStore((s) => s.accessToken);
  const user = useSessionStore((s) => s.user);

  if (!token) return <Outlet />;

  if (user) {
    return <Navigate to={getPostAuthRedirectPath(user)} replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
