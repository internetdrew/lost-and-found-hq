import { useItems } from '@/hooks/useItems';
import { Skeleton } from '../ui/skeleton';
import { Tables } from '@dbTypes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';

type Item = Tables<'items'>;

const ItemList = () => {
  const { data, isLoading } = useItems();

  if (isLoading)
    return (
      <section className='mt-8'>
        <h2 className='text-lg font-semibold'>
          <Skeleton className='w-44 h-8' />
        </h2>
        <ul className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='w-full h-20' />
          ))}
        </ul>
      </section>
    );

  return (
    <section className='my-8'>
      <h2 className='text-lg font-semibold'>
        Pending items: <span className='text-neutral-500'>{data?.length}</span>
      </h2>
      <ul className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {data?.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

const ItemCard = ({ item }: { item: Item }) => {
  const {
    title,
    brief_description: briefDescription,
    found_at: foundAt,
    date_found: dateFound,
  } = item;

  return (
    <Card className='relative'>
      <Button variant='outline' size='sm' className='absolute right-4 top-4'>
        Edit
      </Button>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Found on {new Date(dateFound).toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='font-semibold'>Where was it found?</p>
        <p className='text-sm text-neutral-500'>{foundAt}</p>
        <br />
        <p className='font-semibold'>Description</p>
        <p className='text-sm text-neutral-500'>{briefDescription}</p>
      </CardContent>
    </Card>
  );
};

export default ItemList;
