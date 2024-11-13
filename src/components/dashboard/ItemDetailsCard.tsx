import { Tables } from '@dbTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useState } from 'react';
import ItemFormDialog from './dialogs/ItemFormDialog';
import axios from 'axios';
import toast from 'react-hot-toast';
import DeleteItemDialog from './dialogs/DeleteItemDialog';
import { useItemsAtLocation } from '@/hooks/useItemsAtLocation';
import { useLocationId } from '@/hooks/useLocationId';

type Item = Tables<'items'>;

export default function ItemDetailsCard({ item }: { item: Item }) {
  const [renderItemDialog, setRenderItemDialog] = useState(false);
  const [renderDeleteDialog, setRenderDeleteDialog] = useState(false);
  const { locationId } = useLocationId();
  const { mutate } = useItemsAtLocation(locationId);

  const {
    title,
    brief_description: briefDescription,
    found_at: foundAt,
    date_found: dateFound,
    is_public: isActive,
  } = item;

  const toggleItemActiveStatus = async () => {
    try {
      await axios.patch(
        `/api/v1/locations/${locationId}/items/${item.id}/status`,
        {
          isPublic: !isActive,
        }
      );
      mutate();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item');
    }
  };

  return (
    <li className='ring-1 ring-gray-200 p-4 rounded-md flex flex-col sm:max-w-md'>
      <header className='flex justify-between items-center'>
        <h3 className='font-semibold'>{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger className='self-start p-2 hover:bg-neutral-100 rounded-md'>
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='font-mono'>
            <DropdownMenuLabel>Item Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRenderItemDialog(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRenderDeleteDialog(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <span className='text-sm text-neutral-600'>
        Found on {new Date(dateFound).toDateString()}
      </span>
      <div className='mt-4 flex flex-col flex-1'>
        <p className='font-semibold'>Where it was found</p>
        <p className='text-sm text-neutral-500'>{foundAt}</p>
        <br />
        <p className='font-semibold'>Additional details</p>
        <p className='text-sm text-neutral-500'>{briefDescription}</p>
        <div className='flex items-center mt-auto gap-2 pt-4'>
          <Switch
            id='item-status'
            checked={isActive}
            onCheckedChange={toggleItemActiveStatus}
          />
          <Label htmlFor='item-status'>Publicly visible</Label>
        </div>
      </div>

      <ItemFormDialog
        item={item}
        renderItemDialog={renderItemDialog}
        setRenderItemDialog={setRenderItemDialog}
      />

      <DeleteItemDialog
        item={item}
        renderDeleteDialog={renderDeleteDialog}
        setRenderDeleteDialog={setRenderDeleteDialog}
      />
    </li>
  );
}
