import { Button } from '../ui/button';
import { useState } from 'react';
import ItemFormDialog from './dialogs/ItemFormDialog';
import { useLocations } from '@/hooks/useData';

const AddNewItemButtonAndDialog = () => {
  const { locations, isLoading } = useLocations();
  const [renderItemDialog, setRenderItemDialog] = useState(false);

  return (
    <>
      <Button
        disabled={isLoading || !locations?.[0]}
        onClick={() => setRenderItemDialog(true)}
      >
        Add item
      </Button>
      <ItemFormDialog
        locationId={locations?.[0]?.id ?? ''}
        renderItemDialog={renderItemDialog}
        setRenderItemDialog={setRenderItemDialog}
      />
    </>
  );
};

export default AddNewItemButtonAndDialog;
