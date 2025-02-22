import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import ItemDetailsCard from './ItemDetailsCard';
import { useLocations, useItems } from '@/hooks/useData';
import { Tables } from '@dbTypes';
import ItemFormDialog from './dialogs/ItemFormDialog';
import DeleteItemDialog from './dialogs/DeleteItemDialog';

type Item = Tables<'items'>;

const ItemList = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { locations } = useLocations();
  const { items, isLoading: fetchingItems } = useItems(locations?.[0]?.id);

  const locationId = locations?.[0]?.id;

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <section className='my-10'>
      <h2 className='text-lg font-semibold'>
        {fetchingItems ? (
          <Skeleton className='w-44 h-8' />
        ) : items?.length === 0 ? (
          'No lost items reported'
        ) : (
          <p>
            Managing <span className='text-neutral-500'>{items?.length}</span>{' '}
            lost {items?.length === 1 ? 'item' : 'items'}:
          </p>
        )}
      </h2>
      {fetchingItems ? (
        <ul className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='w-full h-20' />
          ))}
        </ul>
      ) : (
        <ul className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items?.map(item => (
            <ItemDetailsCard
              key={item.id}
              item={item}
              onEditClick={() => handleEditClick(item)}
              onDeleteClick={() => handleDeleteClick(item)}
            />
          ))}
        </ul>
      )}
      {selectedItem && locationId && (
        <ItemFormDialog
          item={selectedItem}
          locationId={locationId}
          renderItemDialog={isEditDialogOpen}
          setRenderItemDialog={setIsEditDialogOpen}
        />
      )}
      {selectedItem && locationId && (
        <DeleteItemDialog
          item={selectedItem}
          locationId={locationId}
          renderDeleteDialog={isDeleteDialogOpen}
          setRenderDeleteDialog={setIsDeleteDialogOpen}
        />
      )}
    </section>
  );
};
export default ItemList;
