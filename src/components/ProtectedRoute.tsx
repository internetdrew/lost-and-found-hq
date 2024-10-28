import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
