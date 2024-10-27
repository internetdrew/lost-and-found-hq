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

const MAX_DESCRIPTION_LENGTH = 120;

const formSchema = z.object({
  category: z.string().min(1, { message: 'Please select a category' }),
  location: z
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      location: '',
      dateFound: '',
      briefDescription: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='electronics'>Electronics</SelectItem>
                    <SelectItem value='clothing'>Clothing</SelectItem>
                    <SelectItem value='accessories'>Accessories</SelectItem>
                    <SelectItem value='documents'>Documents</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where was it found?</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Main Lobby' {...field} />
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
                  <Input type='date' {...field} />
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
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end'>
            <Button type='submit'>Add Item</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default NewItemForm;
