import AddNewItemButtonAndDialog from '@/components/dashboard/AddNewItemButtonAndDialog';
import ItemList from '@/components/dashboard/ItemList';
import LocationInfoCard from '@/components/LocationInfoCard';

export interface CompanyInfo {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const Dashboard = () => {
  return (
    <div className='px-4 sm:px-8'>
      <main>
        <header className='mt-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-lg'>Dashboard</h1>
            <AddNewItemButtonAndDialog />
          </div>
          <p className='text-sm text-gray-600 max-w-md mt-2'>
            Here's where you can manage all of the items lost and found at your
            place of business.
          </p>
          <LocationInfoCard />
        </header>
        <ItemList />
      </main>
    </div>
  );
};

export default Dashboard;