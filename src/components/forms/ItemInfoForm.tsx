import { z } from 'zod';
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
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Tables } from '@dbTypes';
import { useItemsAtLocation } from '@/hooks/useItemsAtLocation';
import { useLocationId } from '@/hooks/useLocationId';
import { INPUT_LENGTHS, itemCategoryOptions } from '@/constants';

type ItemInfoFormProps = {
  onSuccess: () => void;
  item: Tables<'items'> | null;
};

const formSchema = z.object({
  title: z
    .string()
    .min(INPUT_LENGTHS.item.name.min, { message: 'Please enter a title' })
    .max(INPUT_LENGTHS.item.name.max, {
      message: `Title cannot exceed ${INPUT_LENGTHS.item.name.max} characters`,
    }),
  category: z.string().min(1, { message: 'Please select a category' }),
  foundAt: z
    .string()
    .min(INPUT_LENGTHS.item.foundAt.min, {
      message: 'Please enter where the item was found',
    })
    .max(INPUT_LENGTHS.item.foundAt.max, {
      message: `Location cannot exceed ${INPUT_LENGTHS.item.foundAt.max} characters`,
    }),
  dateFound: z
    .string()
    .date()
    .min(1, { message: 'Please enter the date the item was found' }),
  briefDescription: z
    .string()
    .min(INPUT_LENGTHS.item.briefDescription.min, {
      message: 'Please add a brief description of the item',
    })
    .max(INPUT_LENGTHS.item.briefDescription.max, {
      message: `Description should not exceed ${INPUT_LENGTHS.item.briefDescription.max} characters`,
    }),
});

const ItemInfoForm = ({ onSuccess: closeDialog, item }: ItemInfoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { locationId } = useLocationId();
  const { mutate } = useItemsAtLocation(locationId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || '',
      category: item?.category || '',
      foundAt: item?.found_at || '',
      dateFound: item?.date_found || '',
      briefDescription: item?.brief_description || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <>
                    <Input
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
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an item category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='font-mono'>
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
                <FormLabel>Where was it found?</FormLabel>
                <FormControl>
                  <>
                    <Input
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
                <FormLabel>When was it found?</FormLabel>
                <FormControl>
                  <Input type='date' disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='briefDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Description</FormLabel>
                <FormControl>
                  <>
                    <Textarea
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
