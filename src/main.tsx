import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Home from './routes/Home.tsx';
import AuthGuard from './components/AuthGuard.tsx';
import Dashboard from './routes/Dashboard.tsx';
import CustomerPage from './routes/CustomerPage.tsx';
import SubscriptionGuard from './components/SubscriptionGuard.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <AuthGuard requiresAuth={false} rejectAuthUser>
            <Home />
          </AuthGuard>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <AuthGuard requiresAuth>
            <Dashboard />
          </AuthGuard>
        ),
      },
      {
        path: '/location/:locationId',
        element: (
          <SubscriptionGuard>
            <CustomerPage />
          </SubscriptionGuard>
        ),
      },
      {
        path: '/preview/:locationId',
        element: (
          <AuthGuard requiresAuth>
            <CustomerPage preview />
          </AuthGuard>
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
