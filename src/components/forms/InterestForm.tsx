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

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email address' })
    .email({ message: 'Please enter a valid email address' }),
});

export const InterestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/interest', data);
      toast.success('Submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit');
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  };

  return (
    <div className='ring-1 ring-gray-200 rounded-lg p-4 w-full max-w-sm'>
      <h2 className='text-lg font-semibold'>Sign up for updates</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-6 mt-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='john@wick.com'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sign up to receive updates about app launch.
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
