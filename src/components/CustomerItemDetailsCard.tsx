import { Tables } from '@dbTypes';
import { Button } from './ui/button';

type Item = Tables<'items'>;

const CustomerItemDetailsCard = ({ item }: { item: Item }) => {
  return (
    <li className='ring-1 ring-gray-200 p-4 rounded-md flex flex-col sm:max-w-md'>
      <header className='flex justify-between items-center'>
        <h3 className='font-semibold'>{item.title}</h3>
      </header>
      <span className='text-sm text-neutral-500'>
        Found on {new Date(item.date_found).toDateString()}
      </span>
      <div className='mt-4 flex flex-col flex-1'>
        <p className='font-semibold'>Where it was found</p>
        <p className='text-sm text-neutral-500'>{item.found_at}</p>
        <br />
        <p className='font-semibold'>Additional details</p>
        <p className='text-sm text-neutral-500'>{item.brief_description}</p>
        <div className='flex items-center mt-auto gap-2 pt-4'></div>
      </div>
      <Button>Claim this item</Button>
    </li>
  );
};

export default CustomerItemDetailsCard;
