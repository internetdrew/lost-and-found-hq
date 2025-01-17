import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import '@fontsource-variable/noto-sans';

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Outlet />
        <Toaster />
      </div>
    </>
  );
}

export default App;
