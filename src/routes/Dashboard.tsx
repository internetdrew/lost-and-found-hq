import AddNewItemButtonAndDialog from '@/components/dashboard/AddNewItemButtonAndDialog';
import SuccessfulSubscriptionAlert from '@/components/dashboard/alerts/SuccessfulSubscriptionAlert';
import ItemList from '@/components/dashboard/ItemList';
import LocationInfoCard from '@/components/LocationInfoCard';
import { Skeleton } from '@/components/ui/skeleton';
import { LocationIdProvider } from '@/context/LocationIdContext';
import { useLocations } from '@/hooks/useLocations';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface CompanyInfo {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const Dashboard = () => {
  const { data: locations, isLoading: fetchingLocations } = useLocations();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    if (success && sessionId) {
      setShowSuccessAlert(true);
    }
  }, [searchParams]);

  const handleAlertClose = (open: boolean) => {
    setShowSuccessAlert(open);
    if (!open) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('success');
      newParams.delete('session_id');
      setSearchParams(newParams);
    }
  };

  return (
    <div className='px-4 sm:px-8'>
      <main>
        <header className='mt-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-lg'>Dashboard</h1>
            {locations?.[0] && (
              <LocationIdProvider locationId={locations[0].id}>
                <AddNewItemButtonAndDialog />
              </LocationIdProvider>
            )}
          </div>
          <p className='text-sm text-gray-600 max-w-md mt-2'>
            Here's where you can manage all of the items lost and found at your
            place of business.{' '}
            {locations?.length === 0 && 'Start by adding a location.'}
          </p>
          {fetchingLocations ? (
            <Skeleton className='mt-4 max-w-sm w-full h-20' />
          ) : (
            <LocationInfoCard location={locations?.[0] || null} />
          )}
        </header>
        {locations?.[0] && (
          <LocationIdProvider locationId={locations[0].id}>
            <ItemList />
          </LocationIdProvider>
        )}
        <SuccessfulSubscriptionAlert
          open={showSuccessAlert}
          onOpenChange={handleAlertClose}
        />
      </main>
    </div>
  );
};

export default Dashboard;
