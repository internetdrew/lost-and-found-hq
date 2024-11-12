import LocationInfoForm from './forms/LocationInfoForm';
import { Button } from './ui/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useLocations } from '@/hooks/useLocations';
import { Skeleton } from './ui/skeleton';

export default function LocationInfoCard() {
  const { data: locations, isLoading } = useLocations();

  if (isLoading) return <Skeleton className='max-w-sm h-16 mt-4' />;

  return (
    <div className='flex items-start gap-4 mt-4 ring-1 ring-gray-200 p-4 rounded-md max-w-sm'>
      {locations?.length > 0 ? (
        <div>
          <p className='text-sm font-semibold'>Location Info</p>
          <p className='text-sm mt-4'>{locations[0].name}</p>
          <p className='text-sm'>
            {locations[0].address}
            <br />
            {locations[0].city}, {locations[0].state} {locations[0].postal_code}
          </p>
        </div>
      ) : (
        <p className='text-sm'>There's no business location info yet.</p>
      )}
      <Dialog>
        <DialogTrigger asChild>
          {locations?.length > 0 ? (
            <Button variant='outline' className='text-xs w-max ml-auto'>
              Edit
            </Button>
          ) : (
            <Button className='text-xs w-max ml-auto'>Add</Button>
          )}
        </DialogTrigger>
        <DialogContent className='font-mono overflow-y-scroll max-h-screen'>
          <DialogHeader>
            <DialogTitle>Business Location</DialogTitle>
            <DialogDescription>
              Before you can add items, we'll need some details about your
              business location.
            </DialogDescription>
          </DialogHeader>
          <LocationInfoForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
