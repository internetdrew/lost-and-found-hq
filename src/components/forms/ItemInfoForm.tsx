import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Tables } from '@dbTypes';
import { itemCategoryOptions } from '@/constants';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { PopoverClose } from '@radix-ui/react-popover';
import { INPUT_LENGTHS } from '@shared/constants';
import { ItemInput, itemSchema } from '@shared/schemas/item';
import { useItems } from '@/hooks/useData';

type ItemInfoFormProps = {
  onSuccess: () => void;
  item: Tables<'items'> | null;
  locationId: string;
};

const ItemInfoForm = ({
  onSuccess: closeDialog,
  item,
  locationId,
}: ItemInfoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useItems(locationId);
  const dateFoundPopoverRef = useRef<HTMLButtonElement | null>(null);

  const form = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: item?.title || '',
      category: item?.category || '',
      foundAt: item?.found_at || '',
      dateFound: item?.date_found || format(new Date(), 'yyyy-MM-dd'),
      briefDescription: item?.brief_description || '',
      staffDetails: item?.staff_details || '',
    },
  });

  const onSubmit = async (data: ItemInput) => {
    setIsSubmitting(true);
    const method = item ? 'put' : 'post';
    const endpoint = item
      ? `/api/v1/locations/${locationId}/items/${item.id}`
      : `/api/v1/locations/${locationId}/items`;

    try {
      await axios[method](endpoint, {
        ...data,
        locationId,
      });
      mutate();
      toast.success('Item added successfully');
      form.reset();
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { isDirty, isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-6 mt-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='title'>Title</FormLabel>
                <FormControl>
                  <>
                    <Input
                      id='title'
                      placeholder='e.g. Black wallet'
                      disabled={isSubmitting}
                      maxLength={INPUT_LENGTHS.item.name.max}
                      {...field}
                    />
                    <small className='text-xs text-gray-500'>
                      {INPUT_LENGTHS.item.name.max - (field.value?.length || 0)}{' '}
                      characters remaining
                    </small>
                  </>
                </FormControl>
                <FormDescription>
                  Describe the item without giving away details. The true owner
                  will help you identify it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='category'>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger id='category'>
                      <SelectValue placeholder='Select an item category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itemCategoryOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='foundAt'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='foundAt'>Where was it found?</FormLabel>
                <FormControl>
                  <>
                    <Input
                      id='foundAt'
                      placeholder='e.g. Main Lobby'
                      disabled={isSubmitting}
                      maxLength={INPUT_LENGTHS.item.foundAt.max}
                      {...field}
                    />
                    <small className='text-xs text-gray-500'>
                      {INPUT_LENGTHS.item.foundAt.max -
                        (field.value?.length || 0)}{' '}
                      characters remaining
                    </small>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dateFound'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='dateFound'>When was it found?</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(`${field.value}T12:00:00`), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <PopoverClose ref={dateFoundPopoverRef} />
                    <Calendar
                      mode='single'
                      selected={
                        field.value
                          ? new Date(`${field.value}T12:00:00`)
                          : undefined
                      }
                      onSelect={date => {
                        if (date) {
                          field.onChange(format(date, 'yyyy-MM-dd'));
                          dateFoundPopoverRef.current?.click();
                        }
                      }}
                      disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      style={{ pointerEvents: 'auto' }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='briefDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='briefDescription'>
                  Brief Description
                </FormLabel>
                <FormControl>
                  <>
                    <Textarea
                      id='briefDescription'
                      placeholder='E.g. It has a stripe and a logo on the front.'
                      className='resize-none h-32'
                      disabled={isSubmitting}
                      maxLength={INPUT_LENGTHS.item.briefDescription.max}
                      {...field}
                    />
                    <small className='text-xs text-gray-500'>
                      {INPUT_LENGTHS.item.briefDescription.max -
                        (field.value?.length || 0)}{' '}
                      characters remaining
                    </small>
                  </>
                </FormControl>
                <FormDescription>
                  Some details can help discern between similar items. Avoid
                  giving away too much information.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='staffDetails'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='staffDetails'>Staff Details</FormLabel>
                <FormControl>
                  <>
                    <Textarea
                      id='staffDetails'
                      placeholder='E.g. The guy with the green hair who is always laughing dropped this.'
                      className='resize-none h-32'
                      disabled={isSubmitting}
                      maxLength={INPUT_LENGTHS.item.staffDetails.max}
                      {...field}
                    />
                    <small className='text-xs text-gray-500'>
                      {INPUT_LENGTHS.item.briefDescription.max -
                        (field.value?.length || 0)}{' '}
                      characters remaining
                    </small>
                  </>
                </FormControl>
                <FormDescription>
                  These details are only visible to staff. You can be as
                  specific as you want here to help staff identify the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isSubmitting || !isDirty || !isValid}
            >
              {isSubmitting
                ? item
                  ? 'Updating...'
                  : 'Adding...'
                : item
                ? 'Update Item'
                : 'Add Item'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ItemInfoForm;
