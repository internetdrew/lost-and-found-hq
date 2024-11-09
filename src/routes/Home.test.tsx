import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

import Home from './Home';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '@/App';

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
});
