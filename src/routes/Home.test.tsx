import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { beforeAll, afterEach, afterAll } from 'vitest';

import Home from './Home';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '@/App';
import { server } from '@server/mocks/node';
import { http } from 'msw';
import { HttpResponse } from 'msw';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
          <Route index element={<Home />} />
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
    server.use(
      http.post('/auth/login', () => {
        return HttpResponse.json({
          message: 'Login successful',
          redirectTo: '/dashboard',
        });
      })
    );
    renderHome();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password');
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
