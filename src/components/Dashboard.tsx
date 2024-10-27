import { useUser } from '@/hooks/useUser';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='px-4 sm:px-8'>
      <main>
        <header className='mt-6'>
          <h1 className='text-xl'>Dashboard</h1>
          <p className='text-sm text-gray-500'>Welcome to your dashboard.</p>
        </header>
      </main>
    </div>
  );
};

export default Dashboard;
