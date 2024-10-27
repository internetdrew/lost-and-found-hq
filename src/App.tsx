import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div className='font-mono text-neutral-900'>
        <Navbar />
        <Outlet />
        <Toaster />
      </div>
    </>
  );
}

export default App;
