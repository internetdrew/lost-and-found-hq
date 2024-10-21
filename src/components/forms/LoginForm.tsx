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

interface LoginFormProps {
  setFormType: (formType: 'signup' | 'login') => void;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const LoginForm = ({ setFormType }: LoginFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
          <Button type='submit' className='w-full'>
            Login
          </Button>
          <Button
            type='button'
            variant='link'
            className='mx-auto'
            onClick={() => setFormType('signup')}
          >
            Don't have an account yet?
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
