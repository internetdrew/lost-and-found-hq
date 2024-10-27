import axios from 'axios';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { data: user, mutate } = useUser();

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      mutate(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <nav className='flex justify-between items-center p-4 sm:px-8'>
      <a href='/' className='font-semibold text-lg sm:text-xl'>
        Lost & Found HQ
      </a>
      {user && (
        <Button variant='outline' onClick={logout}>
          Log out
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
