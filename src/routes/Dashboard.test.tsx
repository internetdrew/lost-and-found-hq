import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { server } from '@/test/mocks/node';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

const retrievedLocationData = {
  id: 169,
  name: 'Test Location',
  address: '123 Test St',
  city: 'Test City',
  state: 'TX',
  postal_code: '12345',
};

const newLocationData = {
  name: 'Test Location',
  streetAddress: '123 Test St',
  city: 'Test City',
  state: 'TX',
  zipCode: '12345',
};

describe('Dashboard', () => {
  it('renders loading state while fetching locations', () => {
    server.use(
      http.get('/api/v1/locations', () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(new HttpResponse());
          }, 1000);
        });
      })
    );
    render(<Dashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('location-info-skeleton')).toBeInTheDocument();
  });

  it('renders the dashboard with no locations', async () => {
    server.use(
      http.get('/api/v1/locations', () => {
        return HttpResponse.json([]);
      })
    );
    render(<Dashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Here's where you can manage all of the items lost and found at your place of business. Start by adding a location."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("There's no business location info yet.")
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('blocks users from adding a location with incomplete data', async () => {
    server.use(
      http.get('/api/v1/locations', () => {
        return HttpResponse.json([]);
      })
    );
    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByRole('button', { name: /add/i }));
    expect(
      screen.getByRole('dialog', { name: /add location/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter details of the location you'd like to add. Be sure to not include any personal information."
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      'Test Location'
    );
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    await user.type(
      screen.getByRole('textbox', { name: /street address/i }),
      '123 Test St'
    );
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    await user.type(
      screen.getByRole('textbox', { name: /city/i }),
      'Test City'
    );
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();

    await user.click(screen.getByRole('combobox', { name: /state/i }));
    await user.click(screen.getByRole('option', { name: /texas/i }));
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    await user.type(
      screen.getByRole('textbox', { name: /zip code/i }),
      '12345'
    );
    expect(screen.getByRole('button', { name: /add/i })).toBeEnabled();
  });
  it('renders the dashboard with a new location', async () => {
    let postedData: unknown = null;

    server.use(
      http.get('/api/v1/locations', () => {
        return postedData
          ? HttpResponse.json([{ ...retrievedLocationData }])
          : HttpResponse.json([]);
      }),
      http.post('/api/v1/locations', async ({ request }) => {
        postedData = await request.json();
        return HttpResponse.json({
          ...newLocationData,
        });
      }),
      http.get('/api/v1/locations/169/items', () => {
        return HttpResponse.json([]);
      })
    );
    const user = userEvent.setup();
    render(<Dashboard />);

    await user.click(screen.getByRole('button', { name: /add/i }));
    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      newLocationData.name
    );
    await user.type(
      screen.getByRole('textbox', { name: /street address/i }),
      newLocationData.streetAddress
    );
    await user.type(
      screen.getByRole('textbox', { name: /city/i }),
      newLocationData.city
    );
    await user.click(screen.getByRole('combobox', { name: /state/i }));
    await user.click(screen.getByRole('option', { name: /texas/i }));
    await user.type(
      screen.getByRole('textbox', { name: /zip code/i }),
      newLocationData.zipCode
    );
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(postedData).toEqual(newLocationData);
    expect(
      screen.queryByRole('dialog', { name: /add location/i })
    ).not.toBeInTheDocument();

    expect(await screen.findByText('Location Info')).toBeInTheDocument();
    expect(await screen.findByText('Test Location')).toBeInTheDocument();
    expect(await screen.findByText('123 Test St')).toBeInTheDocument();
    expect(await screen.findByText('Test City, TX 12345')).toBeInTheDocument();
    expect(
      await screen.findByText('No lost items reported')
    ).toBeInTheDocument();
  });
  it('allows users to edit a location', async () => {
    let patchedData: unknown = null;
    const originalLocation = {
      id: 169,
      name: 'Test Location',
      address: '123 Test St',
      city: 'Test City',
      state: 'TX',
      postal_code: '12345',
      has_active_subscription: false,
    };

    const updatedLocation = {
      id: 169,
      name: 'Updated Location',
      address: '456 Update St',
      city: 'New City',
      state: 'CA',
      postal_code: '54321',
      has_active_subscription: false,
    };

    server.use(
      http.get('/api/v1/locations', () => {
        return HttpResponse.json([
          patchedData ? updatedLocation : originalLocation,
        ]);
      }),
      http.patch('/api/v1/locations/169', async ({ request }) => {
        patchedData = await request.json();
        return HttpResponse.json(updatedLocation);
      }),
      http.get('/api/v1/locations/169/items', () => {
        return HttpResponse.json([]);
      })
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await screen.findByText('Location Info');

    await user.click(screen.getByTestId('location-info-card-dropdown-trigger'));
    await user.click(screen.getByRole('menuitem', { name: /edit/i }));

    await user.clear(screen.getByRole('textbox', { name: /company name/i }));
    await user.type(
      screen.getByRole('textbox', { name: /company name/i }),
      'Updated Location'
    );

    await user.clear(screen.getByRole('textbox', { name: /street address/i }));
    await user.type(
      screen.getByRole('textbox', { name: /street address/i }),
      '456 Update St'
    );

    await user.clear(screen.getByRole('textbox', { name: /city/i }));
    await user.type(screen.getByRole('textbox', { name: /city/i }), 'New City');

    await user.click(screen.getByRole('combobox', { name: /state/i }));
    await user.click(screen.getByRole('option', { name: /california/i }));

    await user.clear(screen.getByRole('textbox', { name: /zip code/i }));
    await user.type(
      screen.getByRole('textbox', { name: /zip code/i }),
      '54321'
    );

    await user.click(screen.getByRole('button', { name: /update/i }));

    expect(patchedData).toEqual({
      id: 169,
      name: 'Updated Location',
      streetAddress: '456 Update St',
      city: 'New City',
      state: 'CA',
      zipCode: '54321',
    });
    expect(
      screen.queryByRole('dialog', { name: /edit location/i })
    ).not.toBeInTheDocument();

    expect(await screen.findByText('Location Info')).toBeInTheDocument();
    expect(await screen.findByText('Updated Location')).toBeInTheDocument();
    expect(await screen.findByText('456 Update St')).toBeInTheDocument();
    expect(await screen.findByText('New City, CA 54321')).toBeInTheDocument();
  });
  it.skip('allows users to add an item to a location', async () => {
    let postedItemData: unknown = null;
    const location = {
      id: 169,
      name: 'Test Location',
      address: '123 Test St',
      city: 'Test City',
      state: 'TX',
      postal_code: '12345',
      has_active_subscription: false,
    };

    server.use(
      http.get('/api/v1/locations', () => {
        return HttpResponse.json([location]);
      }),
      http.get('/api/v1/locations/169/items', () => {
        return postedItemData
          ? HttpResponse.json([postedItemData])
          : HttpResponse.json([]);
      }),
      http.post('/api/v1/locations/169/items', async ({ request }) => {
        postedItemData = await request.json();
        return HttpResponse.json({
          rave: 'hello',
        });
      })
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await screen.findByText('Location Info');
    await user.click(screen.getByRole('button', { name: /add item/i }));

    expect(
      screen.getByRole('dialog', { name: /add item/i })
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: /title/i }),
      'Lost Wallet'
    );

    await user.click(screen.getByRole('combobox', { name: /category/i }));
    await user.click(screen.getByRole('option', { name: /clothing/i }));

    await user.type(
      screen.getByRole('textbox', { name: /where was it found?/i }),
      'Main Lobby'
    );

    await user.click(screen.getByRole('button', { name: /pick a date/i }));

    // Find today's date button by just its text content (the day number)
    const today = new Date();
    const dayNumber = today.getDate().toString();

    await user.click(
      screen.getByRole('button', { name: new RegExp(`^${dayNumber}$`) })
    );

    await user.type(
      screen.getByRole('textbox', { name: /brief description/i }),
      'Brown leather wallet'
    );

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(postedItemData).toEqual({
      title: 'Lost Wallet',
      category: 'clothing',
      foundAt: 'Main Lobby',
      dateFound: '2024-03-20',
      briefDescription: 'Brown leather wallet',
    });

    expect(
      screen.queryByRole('dialog', { name: /add item/i })
    ).not.toBeInTheDocument();

    expect(await screen.findByText('Lost Wallet')).toBeInTheDocument();
    expect(await screen.findByText('Main Lobby')).toBeInTheDocument();
    expect(await screen.findByText('Brown leather wallet')).toBeInTheDocument();
  });
  it('allows users to edit an item', async () => {});
  it('allows users to delete an item', async () => {});
});
