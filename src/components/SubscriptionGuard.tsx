import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from './Spinner';
import { useSubscriptionValidation } from '@/hooks/useSubscriptionValidation';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

/**
 * A route guard component that protects content based on subscription status.
 * Uses the locationId from URL params to validate if the current location has an active subscription.
 *
 * Features:
 * - Shows a loading spinner during subscription validation
 * - Automatically redirects to 404 page if subscription is invalid
 * - Renders children only when subscription is valid
 *
 * @example
 * <SubscriptionGuard>
 *   <ProtectedContent />
 * </SubscriptionGuard>
 *
 * @param {SubscriptionGuardProps} props - The component props
 * @param {React.ReactNode} props.children - The content to render if subscription is valid
 * @returns {JSX.Element} The wrapped children or a loading spinner
 */

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const { subscriptionValid, isLoading } = useSubscriptionValidation(
    locationId ?? ''
  );

  useEffect(() => {
    if (isLoading) return;

    if (!subscriptionValid) {
      navigate('/404', { replace: true });
      return;
    }
  }, [subscriptionValid, isLoading, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
