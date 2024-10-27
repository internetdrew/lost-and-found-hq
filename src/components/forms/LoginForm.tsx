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
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface LoginFormProps {
  setRenderType: (renderType: 'signup' | 'login' | 'greetings') => void;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const LoginForm = ({ setRenderType }: LoginFormProps) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoggingIn(true);

    if (import.meta.env.PROD) {
      setRenderType('greetings');
      return;
    }

    try {
      await axios.post('/auth/login', data);
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || 'Failed to login. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
        console.error('Login error:', error);
      }
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='ring-1 ring-neutral-900 rounded-lg p-4 mx-auto max-w-sm'
      >
        <h3 className='text-lg font-semibold'>Login</h3>
        <p className='text-sm text-neutral-500'>
          Welcome back! Let's get you logged in to your dashboard.
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
          <Button type='submit' className='w-full' disabled={loggingIn}>
            {loggingIn ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            type='button'
            variant='link'
            className='mx-auto'
            onClick={() => setRenderType('signup')}
          >
            Don't have an account yet?
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
