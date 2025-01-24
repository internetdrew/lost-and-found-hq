import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const SuccessfulSubscriptionAlert = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [searchParams] = useSearchParams();

  const createPortalSession = async () => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      toast.error('Something went wrong');
      return;
    }

    try {
      const {
        data: { url },
      } = await axios.post('/api/v1/stripe/create-portal-session', {
        sessionId,
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You're all set!</AlertDialogTitle>
          <AlertDialogDescription>
            Your subscription has been successfully processed. You can now make
            your portal available to your customers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant='outline' onClick={createPortalSession}>
            Manage billing
          </Button>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuccessfulSubscriptionAlert;
