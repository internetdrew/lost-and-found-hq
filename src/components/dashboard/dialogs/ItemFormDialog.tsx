import { DialogDescription } from '@/components/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import ItemInfoForm from '@/components/forms/ItemInfoForm';
import { Tables } from '@dbTypes';

interface ItemFormDialogProps {
  item?: Tables<'items'> | null;
  renderItemDialog: boolean;
  setRenderItemDialog: (value: boolean) => void;
}

const ItemFormDialog = ({
  item = null,
  renderItemDialog,
  setRenderItemDialog,
}: ItemFormDialogProps) => {
  const title = item ? 'Edit Item' : 'Add Item';
  const description = item
    ? "Enter details of the item you'd like to edit. Be sure to not include any personal information."
    : "Enter details of the item you'd like to add. Be sure to not include any personal information.";

  return (
    <Dialog open={renderItemDialog} onOpenChange={setRenderItemDialog}>
      <DialogContent className='font-mono max-h-[90vh] overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ItemInfoForm
          initialData={item}
          onSuccess={() => setRenderItemDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
