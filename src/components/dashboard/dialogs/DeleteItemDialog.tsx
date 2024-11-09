import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useItems } from '@/hooks/useItems';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Tables } from '@dbTypes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DeleteItemDialogProps {
  item: Tables<'items'>;
  renderDeleteDialog: boolean;
  setRenderDeleteDialog: (value: boolean) => void;
}

const DeleteItemDialog = (props: DeleteItemDialogProps) => {
  const { item, renderDeleteDialog, setRenderDeleteDialog } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate } = useItems();

  const deleteItem = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/v1/items/${item.id}`);
      setRenderDeleteDialog(false);
      mutate();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={renderDeleteDialog} onOpenChange={setRenderDeleteDialog}>
      <DialogContent className='font-mono max-w-md'>
        <DialogHeader>
          <DialogTitle>Delete {item.title}?</DialogTitle>
          <DialogDescription>
            Once you click delete, this item will be permanently removed from
            your inventory and dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={deleteItem} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItemDialog;
