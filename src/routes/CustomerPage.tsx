import axios from 'axios';
import CustomerItemDetailsCard from '@/components/CustomerItemDetailsCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublicItemsAtLocation } from '@/hooks/useItemsAtLocation';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { useLocationValidation } from '@/hooks/useLocationValidation';
import { toast } from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';

interface CustomerPageProps {
  preview?: boolean;
}

const CustomerPage = ({ preview }: CustomerPageProps) => {
  const { locationId } = useParams();
  const { locationInfo, isLoading: loadingLocationInfo } = useLocationInfo(
    locationId ?? ''
  );
  const { items } = usePublicItemsAtLocation(locationId ?? '');
  const { isValid, isLoading: validatingLocation } = useLocationValidation(
    locationId ?? ''
  );

  if (validatingLocation) {
    return (
      <div className='p-4 sm:px-8'>
        <Skeleton className='w-full h-28 max-w-sm' />
      </div>
    );
  }

  if (!locationId || !isValid) {
    return <Navigate to='/404' replace />;
  }

  const handleSubscribe = async () => {
    toast.promise(
      axios
        .post('/api/v1/stripe/create-checkout-session', {
          lookup_key: 'standard_monthly',
          locationId,
        })
        .then(({ data: { url } }) => {
          window.location.assign(url);
        }),
      {
        loading: 'Redirecting to upgrade your plan...',
        success: 'Redirected to upgrade your plan!',
        error: 'Error creating checkout session',
      }
    );
  };

  return (
    <div className='p-4 sm:px-8'>
      {preview && (
        <article className='flex flex-col gap-2 text-sm text-neutral-500 max-w-sm ring-1 ring-neutral-200 p-3 rounded-lg mx-auto mb-4 sm:mx-0'>
          <p>
            This is a preview page for your{' '}
            <strong>{locationInfo?.address}</strong> location.
          </p>
          <p>
            To make this live for your customers to access, you'll need to
            upgrade to a Pro plan.
          </p>
          <Button className='mt-4' onClick={handleSubscribe}>
            Upgrade to Pro
          </Button>
        </article>
      )}
      <h1 className='text-2xl font-bold text-center'>
        Lost and Found at {locationInfo?.name}
      </h1>
      {loadingLocationInfo ? (
        <Skeleton className='max-w-sm mx-auto h-6' />
      ) : (
        <p className='text-center text-neutral-500'>
          {locationInfo?.address}, {locationInfo?.city}, {locationInfo?.state},{' '}
          {locationInfo?.postal_code}
        </p>
      )}

      <section className='mt-10'>
        <ul className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items
            ?.filter(item => item.is_public)
            .map(item => (
              <CustomerItemDetailsCard key={item.id} item={item} />
            ))}
        </ul>
      </section>
    </div>
  );
};

export default CustomerPage;
