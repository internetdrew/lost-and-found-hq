import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Tables } from '@dbTypes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useItems } from '@/hooks/useData';

interface DeleteItemDialogProps {
  item: Tables<'items'>;
  locationId: string;
  renderDeleteDialog: boolean;
  setRenderDeleteDialog: (value: boolean) => void;
}

const DeleteItemDialog = (props: DeleteItemDialogProps) => {
  const { item, locationId, renderDeleteDialog, setRenderDeleteDialog } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate } = useItems(locationId);

  const deleteItem = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/v1/locations/${locationId}/items/${item.id}`);
      mutate();
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    } finally {
      setRenderDeleteDialog(false);
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={renderDeleteDialog} onOpenChange={setRenderDeleteDialog}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='leading-normal max-w-sm'>
            Are you sure you want to delete the{' '}
            <span className='text-neutral-500'>{item.title}</span>?
          </DialogTitle>
          <DialogDescription>
            Once you click delete, this item will be permanently removed from
            your inventory and dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={deleteItem}
            disabled={isDeleting}
            variant='destructive'
            className='bg-red-600 hover:bg-red-700 focus-visible:ring-1 focus-visible:ring-red-700'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItemDialog;
