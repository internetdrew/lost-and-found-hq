import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '@/App';
import RouteGuard from '@/components/RouteGuard';

interface RenderWithRouterOptions {
  initialEntries?: string[];
  requiresAuth?: boolean;
}

export function renderWithRouter(
  component: React.ReactElement,
  { initialEntries = ['/'], requiresAuth = false }: RenderWithRouterOptions = {}
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path='/' element={<App />}>
          <Route
            index
            element={
              <RouteGuard requiresAuth={requiresAuth}>{component}</RouteGuard>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
