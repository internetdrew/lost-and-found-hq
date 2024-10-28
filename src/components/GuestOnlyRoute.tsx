/**
 * A route component that should only be accessible to non-authenticated users (guests).
 * @component
 * @returns {JSX.Element} A React component
 */

import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  return !user ? <>{children}</> : null;
};

export default GuestOnlyRoute;
