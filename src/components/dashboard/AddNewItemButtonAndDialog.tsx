import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import NewItemForm from '../forms/NewItemForm';
import { useLocations } from '@/hooks/useLocations';
import { Skeleton } from '../ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useState } from 'react';

const AddNewItemButtonAndDialog = () => {
  const { data, isLoading } = useLocations();
  const noLocations = data?.length === 0;
  const [open, setOpen] = useState(false);

  if (isLoading) return <Skeleton className='w-20 h-10' />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {noLocations ? (
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button disabled={true}>Add item</Button>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side='top'
              align='start'
              sideOffset={10}
              className='font-mono max-w-xs'
            >
              <p>
                You'll be able to add items once you've added a business
                location.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          <Button>Add item</Button>
        </DialogTrigger>
      )}
      <DialogContent className='font-mono overflow-y-scroll max-h-screen'>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Enter details of the item you'd like to add. Be sure to not include
            any personal information.
          </DialogDescription>
        </DialogHeader>
        <NewItemForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddNewItemButtonAndDialog;
