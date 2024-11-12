import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import LocationInfoForm from '@/components/forms/LocationInfoForm';
import { Tables } from '@dbTypes';

interface LocationFormDialogProps {
  location?: Tables<'locations'> | null;
  renderLocationDialog: boolean;
  setRenderLocationDialog: (value: boolean) => void;
}

const LocationFormDialog = ({
  location = null,
  renderLocationDialog,
  setRenderLocationDialog,
}: LocationFormDialogProps) => {
  const title = location ? 'Edit Location' : 'Add Location';
  const description = location
    ? "Enter details of the location you'd like to edit. Be sure to not include any personal information."
    : "Enter details of the location you'd like to add. Be sure to not include any personal information.";

  return (
    <Dialog open={renderLocationDialog} onOpenChange={setRenderLocationDialog}>
      <DialogContent className='font-mono overflow-y-scroll max-h-screen'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <LocationInfoForm
          location={location}
          onSuccess={() => setRenderLocationDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LocationFormDialog;
