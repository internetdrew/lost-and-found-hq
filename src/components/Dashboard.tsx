import { useEffect } from 'react';

const Dashboard = () => {
  useEffect(() => {
    console.log('Dashboard component mounted');
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
