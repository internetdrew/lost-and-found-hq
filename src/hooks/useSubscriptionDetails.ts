import axios from 'axios';
import useSWR from 'swr';
import { Tables } from '@dbTypes';

type SubscriptionDetails = Tables<'subscriptions'>;
const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    const subscriptionDetails: SubscriptionDetails = response.data;
    return subscriptionDetails;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const useSubscriptionDetails = (locationId: string | null) => {
  const { data, isLoading, error, mutate } = useSWR(
    locationId ? `/api/v1/locations/${locationId}/subscription-details` : null,
    fetcher
  );

  return {
    subscriptionDetails: {
      currentPeriodEnd: data?.current_period_end,
      currentPeriodStart: data?.current_period_start,
      stripeCustomerId: data?.stripe_customer_id,
      stripePriceId: data?.stripe_price_id,
      stripeSubscriptionId: data?.stripe_subscription_id,
      updatedAt: data?.updated_at,
      createdAt: data?.created_at,
      canceledAt: data?.canceled_at,
    },
    isLoading,
    error,
    mutate,
  };
};
