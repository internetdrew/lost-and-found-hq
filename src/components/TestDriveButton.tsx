import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';

const TestDriveButton = () => {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const handleTestDrive = async () => {
    try {
      const res = await axios.post('/auth/start-test-drive');
      toast.success("Let's go for a spin!");
      setTimeout(() => {
        mutate('/auth/user');
        navigate(res.data.redirectTo);
      }, 1000);
      return;
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Button className='mt-4' variant='outline' onClick={handleTestDrive}>
      Start my test drive
    </Button>
  );
};

export default TestDriveButton;
