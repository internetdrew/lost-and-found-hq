import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { beforeAll, afterEach, afterAll } from 'vitest';

import Home from './Home';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '@/App';
import { server } from '@/test/mocks/node';
import { TestUser } from '@/test/mocks/handlers';
import toast from 'react-hot-toast';
import { http } from 'msw';
import { HttpResponse } from 'msw';
import RouteGuard from '@/components/RouteGuard';

interface SWRMockState {
  data: { id: string; email: string } | null;
  isLoading: boolean;
  error: Error | null;
  mutate: ReturnType<typeof vi.fn>;
  isValidating: boolean;
}

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => null,
}));

const mockSWRState: SWRMockState = {
  data: null,
  isLoading: false,
  error: null,
  mutate: vi.fn(),
  isValidating: false,
};

vi.mock('swr', () => ({
  default: () => mockSWRState,
  useSWRConfig: () => ({
    mutate: vi.fn(),
  }),
}));

const setSWRMockData = (data: SWRMockState['data']) => {
  mockSWRState.data = data;
};

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  mockNavigate.mockReset();
});
afterAll(() => server.close());

const renderHome = () => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route
            index
            element={
              <RouteGuard requiresAuth={false}>
                <Home />
              </RouteGuard>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('Home', () => {
  it('renders the home page', async () => {
    renderHome();

    expect(screen.getByText('Lost & Found HQ')).toBeInTheDocument();
    expect(
      screen.getByText('Effortlessly Reunite Customers with Their Lost Items')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Simplify your lost and found process to quickly reconnect customers with their belongings.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Welcome back! Let's get you logged in to your dashboard."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: "Don't have an account yet?" })
    ).toBeInTheDocument();
  });

  it('toggles forms on click', async () => {
    const user = userEvent.setup();
    renderHome();

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    const authFlowSwitchButton = screen.getByRole('button', {
      name: "Don't have an account yet?",
    });
    expect(authFlowSwitchButton).toBeInTheDocument();

    await user.click(authFlowSwitchButton);

    expect(
      screen.queryByRole('button', { name: 'Login' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('renders form validation errors', async () => {
    const user = userEvent.setup();
    renderHome();

    const emailValidationText = 'Please enter a valid email address';
    const passwordValidationText =
      'Password must be at least 8 characters long';

    expect(screen.queryByText(emailValidationText)).not.toBeInTheDocument();
    expect(screen.queryByText(passwordValidationText)).not.toBeInTheDocument();

    const loginButton = screen.getByRole('button', { name: 'Login' });
    await user.click(loginButton);

    expect(screen.getByText(emailValidationText)).toBeInTheDocument();
    expect(screen.getByText(passwordValidationText)).toBeInTheDocument();
  });

  it('successfully logs users in and redirects to the dashboard', async () => {
    const user = userEvent.setup();
    renderHome();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await user.type(emailInput, TestUser.EMAIL);
    await user.type(passwordInput, TestUser.PASSWORD);
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error message for invalid credentials', async () => {
    const user = userEvent.setup();
    renderHome();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await user.type(emailInput, TestUser.EMAIL);
    await user.type(passwordInput, 'invalid-password');
    await user.click(loginButton);

    expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
  });
  it('redirects to the dashboard if a user is already logged in', async () => {
    server.use(
      http.get('/auth/user', () => {
        console.log('Captured a "GET /auth/user" request');
        return HttpResponse.json({
          id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
        });
      })
    );

    // Mock SWR to ensure immediate data availability
    setSWRMockData({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      email: TestUser.EMAIL,
    });
    renderHome();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        replace: true,
      });
    });
  });
});
