import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Home from './routes/Home.tsx';
import RouteGuard from './components/RouteGuard.tsx';
import Dashboard from './routes/Dashboard.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <RouteGuard requiresAuth={false}>
            <Home />
          </RouteGuard>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <RouteGuard requiresAuth>
            <Dashboard />
          </RouteGuard>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
