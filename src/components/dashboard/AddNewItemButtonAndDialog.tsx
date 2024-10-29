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

const AddNewItemButtonAndDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add new item</Button>
      </DialogTrigger>
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
