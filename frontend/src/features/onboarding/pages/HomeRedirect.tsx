import { Navigate } from 'react-router';
import { useApp } from '@/app/context/AppContext';

export function HomeRedirect() {
  const { state } = useApp();
  return <Navigate to={state.onboardingComplete ? '/dashboard' : '/onboarding'} replace />;
}
