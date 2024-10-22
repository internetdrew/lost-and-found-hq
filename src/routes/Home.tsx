import LoginForm from '@/components/forms/LoginForm';
import SignUpForm from '@/components/forms/SignUpForm';
import { useState } from 'react';

const Home = () => {
  const [formType, setFormType] = useState<'signup' | 'login'>('login');

  return (
    <div className='max-w-screen-xl mx-auto'>
      <header className='text-center max-w-xl mx-auto mt-10 px-4 sm:px-0'>
        <h1 className='text-xl font-bold sm:text-3xl'>
          Reconnect Customers with Their Lost Items in No Time
        </h1>
        <h2 className='mt-2 sm:text-lg'>
          Streamline your lost and found process for fast, hassle-free reunions.
        </h2>
      </header>
      <main className='mt-10 px-4 sm:px-0'>
        {formType === 'signup' ? (
          <SignUpForm setFormType={setFormType} />
        ) : (
          <LoginForm setFormType={setFormType} />
        )}
      </main>
    </div>
  );
};

export default Home;
