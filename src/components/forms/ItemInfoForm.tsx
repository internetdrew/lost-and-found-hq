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

const MAX_DESCRIPTION_LENGTH = 120;

type ItemInfoFormProps = {
  onSuccess: () => void;
  item: Tables<'items'> | null;
  locationId: number;
};

const formSchema = z.object({
  title: z.string().min(1, { message: 'Please enter a title' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  foundAt: z
    .string()
    .min(1, { message: 'Please enter where the item was found' }),
  dateFound: z
    .string()
    .min(1, { message: 'Please enter the date the item was found' }),
  briefDescription: z
    .string()
    .min(1, { message: 'Please add a brief description of the item' })
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description should not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
    }),
});

const ItemInfoForm = ({
  onSuccess: closeDialog,
  item,
  locationId,
}: ItemInfoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
                  <Input
                    placeholder='e.g. Black wallet'
                    disabled={isSubmitting}
                    {...field}
                  />
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
                    <SelectItem value='electronics'>
                      Electronics & Devices
                    </SelectItem>
                    <SelectItem value='wallets'>Wallets & Purses</SelectItem>
                    <SelectItem value='clothing'>Clothing & Bags</SelectItem>
                    <SelectItem value='jewelry'>Jewelry & Watches</SelectItem>
                    <SelectItem value='documents'>ID & Documents</SelectItem>
                    <SelectItem value='keys'>Keys & Cards</SelectItem>
                    <SelectItem value='other'>Other Items</SelectItem>
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
                  <Input
                    placeholder='e.g. Main Lobby'
                    disabled={isSubmitting}
                    {...field}
                  />
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
                  <Textarea
                    placeholder='E.g. It has a stripe and a logo on the front.'
                    className='resize-none h-24'
                    disabled={isSubmitting}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    {...field}
                  />
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
            <Button type='submit' disabled={isSubmitting}>
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
