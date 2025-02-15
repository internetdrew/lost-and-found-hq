import { Tables } from '@dbTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ItemClaimForm } from './forms/ItemClaimForm';

interface ItemClaimDialogProps {
  locationId: string;
  item: Tables<'items'>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ItemClaimDialog = ({
  locationId,
  open,
  onOpenChange,
  item,
}: ItemClaimDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-y-auto max-h-svh'>
        <DialogHeader>
          <DialogTitle>Claim {item?.title}</DialogTitle>
          <DialogDescription>
            To claim this item, you'll need to provide some information to help
            us verify that it belongs to you.
          </DialogDescription>
        </DialogHeader>
        <ItemClaimForm
          locationId={locationId}
          item={item}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ItemClaimDialog;
