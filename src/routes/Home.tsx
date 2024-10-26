import { useState } from 'react';
import LoginForm from '@/components/forms/LoginForm';
import SignUpForm from '@/components/forms/SignUpForm';
import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Home = () => {
  const [renderType, setRenderType] = useState<
    'signup' | 'login' | 'greetings'
  >('login');
  const navigate = useNavigate();
  const { data } = useSWR('/auth/user', fetcher);

  if (data?.user) {
    navigate('/dashboard');
  }

  return (
    <div className='max-w-screen-xl mx-auto'>
      <header className='text-center max-w-xl mx-auto mt-10 px-4 sm:px-0'>
        <h1 className='text-xl font-bold sm:text-3xl'>
          Effortlessly Reunite Customers with Their Lost Items
        </h1>
        <h2 className='mt-2 sm:text-lg'>
          Simplify your lost and found process to quickly reconnect customers
          with their belongings.
        </h2>
      </header>
      <main className='mt-10 px-4 sm:px-0'>
        {renderType === 'signup' ? (
          <SignUpForm setRenderType={setRenderType} />
        ) : renderType === 'login' ? (
          <LoginForm setRenderType={setRenderType} />
        ) : (
          <Card className='max-w-md mx-auto'>
            <CardHeader>
              <CardTitle>Hi there!</CardTitle>
              <CardDescription>
                Thanks for visiting. I'm working on getting the app ready for
                users to play around with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm'>
                I'll soon be opening up access to the app with a test user. Want
                to say hi? You can find me on{' '}
                <a
                  href='https://x.com/_internetdrew'
                  target='_blank'
                  className='text-pink-600 underline-offset-2 hover:underline'
                >
                  X
                </a>{' '}
                (this name will never settle like "Twitter" did) and{' '}
                <a
                  href='https://www.linkedin.com/in/internetdrew/'
                  target='_blank'
                  className='text-pink-600 underline-offset-2 hover:underline'
                >
                  LinkedIn
                </a>
                .
              </p>
            </CardContent>
            <CardFooter>
              <p className='text-sm text-muted-foreground'>See you around!</p>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Home;
