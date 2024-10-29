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

const AddNewItemButtonAndDialog = () => {
  const { data, isLoading } = useLocations();
  const noLocations = data?.length === 0;

  if (isLoading) return <Skeleton className='w-20 h-10' />;

  return (
    <Dialog>
      {noLocations ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button disabled={noLocations}>Add new item</Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side='top' align='center' sideOffset={5}>
              <p>You need to add a location first</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          <Button>Add new item</Button>
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
        <NewItemForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddNewItemButtonAndDialog;
