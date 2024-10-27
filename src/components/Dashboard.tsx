import { useUser } from '@/hooks/useUser';
import { Navigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NewItemForm from './forms/NewItemForm';

const Dashboard = () => {
  const { data: user } = useUser();

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='px-4 sm:px-8'>
      <main>
        <header className='mt-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-lg'>Dashboard</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add new item</Button>
              </DialogTrigger>
              <DialogContent className='font-mono overflow-y-scroll max-h-screen'>
                <DialogHeader>
                  <DialogTitle>Add Item</DialogTitle>
                  <DialogDescription>
                    Enter details of the item you'd like to add. Be sure to not
                    include any personal information.
                  </DialogDescription>
                </DialogHeader>
                <NewItemForm />
              </DialogContent>
            </Dialog>
          </div>
          <p className='text-sm text-gray-600 max-w-md mt-2'>
            Welcome to your dashboard. Here, you can manage all of the items
            lost and found at your place of business.
          </p>
        </header>
      </main>
    </div>
  );
};

export default Dashboard;
