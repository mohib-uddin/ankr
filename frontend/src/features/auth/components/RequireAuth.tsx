import { Navigate, Outlet, useLocation } from 'react-router';
import { useSessionStore } from '@/store/session.store';

/** Requires a persisted session (access token). */
export function RequireAuth() {
  const token = useSessionStore((s) => s.accessToken);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
