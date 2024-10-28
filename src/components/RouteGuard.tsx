import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

interface RouteGuardProps {
  children: React.ReactNode;
  requiresAuth: boolean;
  redirectTo?: string;
}

const RouteGuard = ({
  children,
  requiresAuth,
  redirectTo = requiresAuth ? '/' : '/dashboard',
}: RouteGuardProps) => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && (requiresAuth ? !user : user)) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, isLoading, navigate, requiresAuth, redirectTo]);

  if (isLoading) {
    return <Spinner />;
  }

  return (requiresAuth ? user : !user) ? <>{children}</> : null;
};

export default RouteGuard;
