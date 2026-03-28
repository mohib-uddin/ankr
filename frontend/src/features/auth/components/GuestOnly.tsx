import { Navigate, Outlet } from 'react-router';
import { useSessionStore } from '@/store/session.store';

/** Redirects authenticated users away from login/signup. */
export function GuestOnly() {
  const token = useSessionStore((s) => s.accessToken);
  if (token) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
