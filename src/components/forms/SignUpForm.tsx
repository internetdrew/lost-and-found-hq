import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface SignUpFormProps {
  setRenderType: (renderType: 'signup' | 'login' | 'greetings') => void;
}

const formSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SignUpForm = ({ setRenderType }: SignUpFormProps) => {
  const [signingUp, setSigningUp] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSigningUp(true);
    if (import.meta.env.PROD) {
      setRenderType('greetings');
      return;
    }

    try {
      await axios.post('/auth/signup', data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || 'Failed to sign up. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='ring-1 ring-neutral-900 rounded-lg p-4 mx-auto max-w-sm'
      >
        <h3 className='text-lg font-semibold'>Sign up</h3>
        <p className='text-sm text-neutral-500'>
          Welcome! Join to start reuniting your customers with their lost items.
        </p>
        <div className='space-y-6 mt-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder='you@company.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='********' {...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input placeholder='********' {...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={signingUp}>
            {signingUp ? 'Signing up...' : 'Sign up'}
          </Button>

          <Button
            type='button'
            variant='link'
            className='mx-auto'
            onClick={() => setRenderType('login')}
          >
            Already have an account?
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
