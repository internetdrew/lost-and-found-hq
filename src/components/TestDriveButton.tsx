import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import axios from 'axios';

const TestDriveButton = () => {
  const handleTestDrive = async () => {
    try {
      await axios.post('/auth/start-test-drive');
      toast.success("Let's go for a spin!");
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Button className='mt-4' onClick={handleTestDrive}>
      Start my test drive
    </Button>
  );
};

export default TestDriveButton;
