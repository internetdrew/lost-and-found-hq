import { Button } from './ui/button';
import LocationFormDialog from './dashboard/dialogs/LocationFormDialog';
import { useState } from 'react';
import { Tables } from '@dbTypes';

type Location = Tables<'locations'>;

export default function LocationInfoCard({
  location,
}: {
  location: Location | null;
}) {
  const [renderLocationDialog, setRenderLocationDialog] = useState(false);

  return (
    <div className='flex items-start gap-4 mt-4 ring-1 ring-gray-200 p-4 rounded-md max-w-sm'>
      {location ? (
        <>
          <div>
            <p className='text-sm font-semibold'>Location Info</p>
            <p className='text-sm mt-4'>{location.name}</p>
            <p className='text-sm'>
              {location.address}
              <br />
              {location.city}, {location.state} {location.postal_code}
            </p>
          </div>
          <Button
            variant='outline'
            className='text-xs w-max ml-auto'
            onClick={() => setRenderLocationDialog(true)}
          >
            Edit
          </Button>
        </>
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
