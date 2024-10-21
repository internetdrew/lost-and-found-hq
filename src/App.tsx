import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div className='font-mono text-neutral-900'>
        <Navbar />
        <Outlet />
      </div>
    </>
  );
}

export default App;
