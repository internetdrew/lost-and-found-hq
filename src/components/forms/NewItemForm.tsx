import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
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
import { useLocations } from '@/hooks/useLocations';

const MAX_DESCRIPTION_LENGTH = 120;

const formSchema = z.object({
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

const NewItemForm = () => {
  const [addingItem, setAddingItem] = useState(false);
  const { data: locations } = useLocations();
  const locationId = locations?.[0]?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      foundAt: '',
      dateFound: '',
      briefDescription: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setAddingItem(true);
    try {
      const res = await axios.post('/api/v1/items', {
        ...data,
        locationId,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item');
    } finally {
      setAddingItem(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-6 mt-4'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which category does this item belong to?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={addingItem}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
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
                    disabled={addingItem}
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
                  <Input type='date' disabled={addingItem} {...field} />
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
                    placeholder='Add a brief description of the item'
                    className='resize-none h-24'
                    disabled={addingItem}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={addingItem}>
              {addingItem ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default NewItemForm;
