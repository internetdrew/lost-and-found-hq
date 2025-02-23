import axios from 'axios';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
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
    <nav className='sticky top-0 flex justify-between items-center bg-white p-4 sm:px-8'>
      <a href='/' className='font-semibold text-lg sm:text-xl'>
        Lost & Found HQ
      </a>
      <div className='flex items-center gap-4'>
        <ul className='flex items-center gap-4'>
          <li>
            <Link to='/claims' className='hover:underline underline-offset-4'>
              Claims
            </Link>
          </li>
        </ul>
        {user && (
          <Button variant='outline' onClick={logout} disabled={loggingOut}>
            {loggingOut ? 'Logging out...' : 'Log out'}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
