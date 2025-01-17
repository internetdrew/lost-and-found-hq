import { useState } from 'react';
import LoginForm from '@/components/forms/LoginForm';
import SignUpForm from '@/components/forms/SignUpForm';
import { InterestForm } from '@/components/forms/InterestForm';
import TestDriveButton from '@/components/TestDriveButton';

const Home = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  const [renderType, setRenderType] = useState<
    'signup' | 'login' | 'greetings'
  >('login');

  return (
    <div className='max-w-screen-xl mx-auto'>
      <header className='text-center max-w-xl mx-auto my-10 px-4 sm:px-0'>
        <h1 className='text-xl font-bold sm:text-3xl'>
          Effortlessly Reunite Customers with Their Lost Items
        </h1>
        <h2 className='mt-2 sm:text-lg'>
          Simplify your lost and found process to quickly reconnect customers
          with their belongings.
        </h2>
      </header>
      <main className='px-4 sm:px-0'>
        <div className='max-w-xl mx-auto flex flex-col items-center'>
          <div className='flex flex-col items-center mb-6'>
            <p className='text-sm text-muted-foreground text-center'>
              Thanks for visiting the app! <br />
              Feel free to take it for a spin with the test account.
            </p>
            <TestDriveButton />
          </div>
          {!isTest && <InterestForm />}
        </div>
        {(!isProduction || isTest) &&
          (renderType === 'signup' ? (
            <SignUpForm setRenderType={setRenderType} />
          ) : (
            <LoginForm setRenderType={setRenderType} />
          ))}
      </main>
    </div>
  );
};

export default Home;
