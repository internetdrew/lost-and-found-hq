import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiresAuth: boolean;
  rejectAuthUser?: boolean;
}

const AuthGuard = ({
  children,
  requiresAuth,
  rejectAuthUser,
}: AuthGuardProps) => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (requiresAuth && !user) {
      navigate('/', { replace: true });
      return;
    }

    if (!requiresAuth && user && rejectAuthUser) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [user, isLoading, navigate, requiresAuth, rejectAuthUser]);

  if (isLoading) {
    return <Spinner />;
  }

  return (requiresAuth ? user : !user) ? <>{children}</> : null;
};

export default AuthGuard;
