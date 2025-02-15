import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Tables } from '@dbTypes';
import { Textarea } from '../ui/textarea';
import { INPUT_LENGTHS } from '@shared/constants';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Email must be a valid email address.',
  }),
  itemDetails: z.string().min(10, {
    message: 'Item details must be at least 10 characters.',
  }),
});

export const ItemClaimForm = ({
  locationId,
  item,
  onSuccess,
}: {
  locationId: string;
  item: Tables<'items'>;
  onSuccess: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      itemDetails: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/public/items/claim', {
        itemId: item.id,
        locationId,
        ...data,
      });
      toast.success('Submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit');
    } finally {
      setIsSubmitting(false);
      form.reset();
      onSuccess();
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='John'
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
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Wick'
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='john@wick.com'
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
              name='itemDetails'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Details</FormLabel>
                  <FormControl>
                    <>
                      <Textarea
                        placeholder='Tell us about the item you are claiming.'
                        disabled={isSubmitting}
                        {...field}
                        onInput={e => {
                          e.currentTarget.style.height = 'auto';
                          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                        }}
                        className='field-sizing-content resize-none overflow-hidden'
                        maxLength={INPUT_LENGTHS.itemClaim.itemDetails.max}
                      />
                      <small className='text-xs text-gray-500'>
                        {INPUT_LENGTHS.itemClaim.itemDetails.max -
                          (field.value?.length || 0)}{' '}
                        characters remaining
                      </small>
                    </>
                  </FormControl>
                  <FormDescription>
                    Please provide as much information as possible about the
                    item you are claiming.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
