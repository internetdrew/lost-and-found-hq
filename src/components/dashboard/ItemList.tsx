import { useItemsAtLocation } from '@/hooks/useItemsAtLocation';
import { Skeleton } from '../ui/skeleton';
import ItemDetailsCard from './ItemDetailsCard';

const ItemList = ({ locationId }: { locationId: number }) => {
  const { data, isLoading } = useItemsAtLocation(locationId);

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
    <section className='my-10'>
      <h2 className='text-lg font-semibold'>
        {data?.length === 0 ? (
          'No lost items reported'
        ) : (
          <p>
            Managing <span className='text-neutral-500'>{data?.length}</span>{' '}
            lost {data?.length === 1 ? 'item' : 'items'}:
          </p>
        )}
      </h2>
      <ul className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {data?.map(item => (
          <ItemDetailsCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};
export default ItemList;
