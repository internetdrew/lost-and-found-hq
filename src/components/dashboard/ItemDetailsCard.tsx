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
import axios from 'axios';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { useItems } from '@/hooks/useData';

type Item = Tables<'items'>;

interface ItemDetailsCardProps {
  item: Item;
  onEditClick: (item: Item) => void;
  onDeleteClick: (item: Item) => void;
}

export default function ItemDetailsCard({
  item,
  onEditClick,
  onDeleteClick,
}: ItemDetailsCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const locationId = item.location_id;
  const { mutate } = useItems(locationId);

  const {
    title,
    brief_description: briefDescription,
    found_at: foundAt,
    date_found: dateFound,
    is_public: isActive,
    staff_details: staffDetails,
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
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger
            aria-label={`item-actions-${item.id}`}
            className='self-start p-2 hover:bg-neutral-100 rounded-md'
          >
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Item Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDropdownOpen(false);
                onEditClick(item);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDropdownOpen(false);
                onDeleteClick(item);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <span className='text-sm text-neutral-600'>
        Found on {format(parseISO(dateFound), 'MMM d, yyyy')}
      </span>
      <div className='mt-4 flex flex-col flex-1'>
        <p className='font-semibold'>Where it was found</p>
        <p className='text-sm text-neutral-500'>{foundAt}</p>
        <br />
        <p className='font-semibold'>Public details</p>
        <p className='text-sm text-neutral-500'>{briefDescription}</p>
        <br />
        <p className='font-semibold'>Staff details</p>
        <p className='text-sm text-neutral-500'>{staffDetails}</p>
        <div className='flex items-center mt-auto gap-2 pt-4'>
          <Switch
            id='item-status'
            checked={isActive}
            onCheckedChange={toggleItemActiveStatus}
          />
          <Label htmlFor='item-status'>Publicly visible</Label>
        </div>
      </div>
    </li>
  );
}
