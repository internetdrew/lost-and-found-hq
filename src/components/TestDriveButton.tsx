import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import { useState } from 'react';

const TestDriveButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  const handleTestDrive = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('/auth/start-test-drive');
      mutate('/auth/user');
      navigate(res.data.redirectTo);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button className='mt-4' variant='outline' onClick={handleTestDrive}>
      {isLoading ? 'Starting your test drive...' : 'Start my test drive'}
    </Button>
  );
};

export default TestDriveButton;
