import { Button } from '../ui/button';
import { useLocations } from '@/hooks/useLocations';
import { Skeleton } from '../ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useState } from 'react';
import ItemFormDialog from './dialogs/ItemFormDialog';

const AddNewItemButtonAndDialog = () => {
  const { data: locations, isLoading } = useLocations();
  const noLocations = locations?.length === 0;
  const [renderItemDialog, setRenderItemDialog] = useState(false);

  if (isLoading) return <Skeleton className='w-20 h-10' />;
  return (
    <>
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
        <>
          <Button onClick={() => setRenderItemDialog(true)}>Add item</Button>
          <ItemFormDialog
            renderItemDialog={renderItemDialog}
            setRenderItemDialog={setRenderItemDialog}
          />
        </>
      )}
    </>
  );
};

export default AddNewItemButtonAndDialog;
