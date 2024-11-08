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

type Item = Tables<'items'>;

export default function ItemDetailsCard({ item }: { item: Item }) {
  const {
    title,
    brief_description: briefDescription,
    found_at: foundAt,
    date_found: dateFound,
  } = item;

  return (
    <li className='ring-1 ring-gray-200 p-4 rounded-md flex flex-col sm:max-w-md'>
      <header className='flex justify-between items-center'>
        <h3 className='font-semibold'>{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger className='self-start'>
            <button className='p-2 grid place-items-center hover:bg-neutral-100 rounded-md'>
              <DotsHorizontalIcon />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='font-mono'>
            <DropdownMenuLabel>Item Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
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
          <Switch id='item-active' />
          <Label htmlFor='item-active'>Active item</Label>
        </div>
      </div>
    </li>
  );
}
