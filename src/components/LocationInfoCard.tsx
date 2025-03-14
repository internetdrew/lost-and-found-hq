import { Button } from './ui/button';
import LocationFormDialog from './dashboard/dialogs/LocationFormDialog';
import { useState } from 'react';
import { Tables } from '@dbTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { useSubscriptionValidation } from '@/hooks/useSubscriptionValidation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSubscriptionDetails } from '@/hooks/useSubscriptionDetails';
import { format, parseISO } from 'date-fns';

type Location = Tables<'locations'>;

export default function LocationInfoCard({
  location,
}: {
  location: Location | null;
}) {
  const [renderLocationDialog, setRenderLocationDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { subscriptionValid } = useSubscriptionValidation(location?.id || null);
  const { subscriptionDetails } = useSubscriptionDetails(location?.id || null);

  const customerPageUrl = subscriptionValid
    ? `/location/${location?.id}`
    : `/preview/${location?.id}`;
  const customerPageLabel = subscriptionValid
    ? 'Visit Customer Page'
    : 'Preview Customer Page';

  const openBillingPortal = async () => {
    try {
      const {
        data: { url },
      } = await axios.post('/api/v1/stripe/create-billing-portal-session', {
        stripeCustomerId: subscriptionDetails?.stripeCustomerId,
      });
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='flex items-start gap-4 mt-6 ring-1 ring-gray-200 p-4 rounded-md max-w-sm'>
      {location ? (
        <div className='w-full'>
          <header className='flex justify-between items-center'>
            <p className='text-sm font-semibold'>Location Info</p>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger
                data-testid='location-info-card-dropdown-trigger'
                className='self-start p-2 hover:bg-neutral-100 rounded-md'
              >
                <DotsHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Location Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setDropdownOpen(false);
                    setRenderLocationDialog(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                {subscriptionValid && (
                  <DropdownMenuItem
                    onClick={() => {
                      setDropdownOpen(false);
                      openBillingPortal();
                    }}
                  >
                    Manage Billing
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link to={customerPageUrl} className='w-full'>
                    {customerPageLabel}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <p className='text-sm'>{location.name}</p>
          <p className='text-sm'>{location.address}</p>
          <p className='text-sm'>
            {location.city}, {location.state} {location.postal_code}
          </p>
          {subscriptionValid && subscriptionDetails?.canceledAt && (
            <p className='text-sm mt-4 font-semibold'>
              Subscription ends on{' '}
              {subscriptionDetails?.currentPeriodEnd &&
                format(
                  parseISO(subscriptionDetails.currentPeriodEnd),
                  'MMM d, yyyy'
                )}
            </p>
          )}
        </div>
      ) : (
        <>
          <p className='text-sm'>There's no business location info yet.</p>
          <Button
            className='text-xs w-max ml-auto'
            onClick={() => setRenderLocationDialog(true)}
          >
            Add
          </Button>
        </>
      )}

      <LocationFormDialog
        location={location}
        renderLocationDialog={renderLocationDialog}
        setRenderLocationDialog={setRenderLocationDialog}
      />
    </div>
  );
}
