import { Button } from '../ui/button';
import { useState } from 'react';
import ItemFormDialog from './dialogs/ItemFormDialog';

const AddNewItemButtonAndDialog = () => {
  const [renderItemDialog, setRenderItemDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setRenderItemDialog(true)}>Add item</Button>
      <ItemFormDialog
        renderItemDialog={renderItemDialog}
        setRenderItemDialog={setRenderItemDialog}
      />
    </>
  );
};

export default AddNewItemButtonAndDialog;
