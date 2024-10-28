import axios from 'axios';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Navbar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { data: user, mutate } = useUser();

  const logout = async () => {
    setLoggingOut(true);
    try {
      await axios.post('/auth/logout');
      mutate(null);
      navigate('/');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || 'Failed to logout. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className='flex justify-between items-center p-4 sm:px-8'>
      <a href='/' className='font-semibold text-lg sm:text-xl'>
        Lost & Found HQ
      </a>
      {user && (
        <Button variant='outline' onClick={logout} disabled={loggingOut}>
          {loggingOut ? 'Logging out...' : 'Log out'}
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
