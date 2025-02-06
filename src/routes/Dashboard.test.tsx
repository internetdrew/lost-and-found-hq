import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { server } from '@/test/mocks/node';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { format } from 'date-fns';

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
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('location-info-skeleton')).toBeInTheDocument();
  });

  it('renders the dashboard with no locations', async () => {
    server.use(
      http.get('/api/v1/locations', () => {
        return HttpResponse.json([]);
      })
    );
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

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

  it.skip('blocks users from adding a location with incomplete data', async () => {
    server.use(
      http.get('/api/v1/locations', () => {
        return HttpResponse.json([]);
      })
    );
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

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

    const stateSelect = screen.getByRole('combobox', {
      name: /state/i,
    });
    await user.click(stateSelect);
    screen.debug(stateSelect);

    // await user.click(screen.getByRole('option', { name: /texas/i }));

    // await user.click(screen.getByRole('option', { name: /texas/i }));
    // expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
    // await user.type(
    //   screen.getByRole('textbox', { name: /zip code/i }),
    //   '12345'
    // );
    // expect(screen.getByRole('button', { name: /add/i })).toBeEnabled();
  });
  it.skip('renders the dashboard with a new location', async () => {
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
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

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
  it.skip('allows users to edit a location', async () => {
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
      user_id: '1',
      name: 'Test Location',
      street_address: '123 Test St',
      city: 'Test City',
      state: 'TX',
      zip_code: '12345',
    };

    server.use(
      http.get('/api/v1/locations', () => {
        return HttpResponse.json([location]);
      }),
      http.get('/api/v1/locations/169/items', () => {
        return postedItemData
          ? HttpResponse.json([
              {
                id: 1,
                title: 'Lost Wallet',
                category: 'clothing',
                found_at: 'Main Lobby',
                date_found: format(new Date(), 'yyyy-MM-dd'),
                brief_description: 'Brown leather wallet',
                staff_details:
                  'This thing is packed with receipts and ketchup packets!',
                created_at: new Date().toISOString(),
                status: 'pending',
                is_public: false,
                location_id: 169,
              },
            ])
          : HttpResponse.json([]);
      }),
      http.post('/api/v1/locations/169/items', async ({ request }) => {
        postedItemData = await request.json();
        return HttpResponse.json({
          id: 1,
          title: 'Lost Wallet',
          category: 'clothing',
          found_at: 'Main Lobby',
          date_found: format(new Date(), 'yyyy-MM-dd'),
          brief_description: 'Brown leather wallet',
          staff_details:
            'This thing is packed with receipts and ketchup packets!',
          created_at: new Date().toISOString(),
          status: 'pending',
          is_public: false,
          location_id: 169,
        });
      })
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    screen.debug();

    await screen.findByText('Location Info');
    await user.click(screen.getByRole('button', { name: /add item/i }));

    expect(
      screen.getByRole('dialog', { name: /add item/i })
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: /title/i }),
      'Lost Wallet'
    );

    const categorySelect = screen.getByRole('combobox', {
      name: /category/i,
    });
    await user.click(categorySelect);

    // await user.click(screen.getByRole('combobox', { name: /category/i }));
    // await user.click(screen.getByRole('option', { name: /clothing/i }));

    await user.type(
      screen.getByRole('textbox', { name: /where was it found?/i }),
      'Main Lobby'
    );

    await user.type(
      screen.getByRole('textbox', { name: /brief description/i }),
      'Brown leather wallet'
    );

    await user.type(
      screen.getByRole('textbox', { name: /staff details/i }),
      'This thing is packed with receipts and ketchup packets!'
    );

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(postedItemData).toEqual({
      title: 'Lost Wallet',
      category: 'clothing',
      foundAt: 'Main Lobby',
      dateFound: format(new Date(), 'yyyy-MM-dd'),
      briefDescription: 'Brown leather wallet',
      staffDetails: 'This thing is packed with receipts and ketchup packets!',
      locationId: 169,
    });

    expect(
      screen.queryByRole('dialog', { name: /add item/i })
    ).not.toBeInTheDocument();

    expect(await screen.findByText('Lost Wallet')).toBeInTheDocument();
    expect(await screen.findByText('Main Lobby')).toBeInTheDocument();
    expect(await screen.findByText('Brown leather wallet')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'This thing is packed with receipts and ketchup packets!'
      )
    ).toBeInTheDocument();
  });
  it.skip('allows users to edit an item', async () => {
    let putItemData: unknown = null;

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
        return putItemData
          ? HttpResponse.json([
              {
                id: 1,
                title: 'Lost Wallet',
                category: 'clothing',
                found_at: 'Main Lobby',
                date_found: format(new Date(), 'yyyy-MM-dd'),
                brief_description: 'Brown leather wallet',
                staff_details:
                  'This thing is packed with receipts and ketchup packets!',
                created_at: new Date().toISOString(),
                status: 'pending',
                is_public: false,
                location_id: 169,
              },
            ])
          : HttpResponse.json([]);
      }),
      http.put('/api/v1/locations/169/items/1', async ({ request }) => {
        putItemData = await request.json();
        return HttpResponse.json({
          id: 1,
          title: 'Lost Wallet XYZL',
          category: 'clothing',
          found_at: 'On the dance floor',
          date_found: format(new Date(), 'yyyy-MM-dd'),
          brief_description: 'Brown leather wallet',
          staff_details:
            'This thing is packed with receipts and ketchup packets!',
          created_at: new Date().toISOString(),
          status: 'pending',
          is_public: true,
          location_id: 169,
        });
      })
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await screen.findByText('Lost Wallet');
    await user.click(screen.getByLabelText('item-actions-1'));
    await user.click(screen.getByRole('menuitem', { name: /edit/i }));

    expect(
      screen.queryByRole('dialog', { name: /edit item/i })
    ).toBeInTheDocument();

    await user.clear(screen.getByRole('textbox', { name: /title/i }));
    await user.type(
      screen.getByRole('textbox', { name: /title/i }),
      'Lost Wallet XYZL'
    );
    await user.clear(
      screen.getByRole('textbox', { name: /where was it found?/i })
    );
    await user.type(
      screen.getByRole('textbox', { name: /where was it found?/i }),
      'On the dance floor'
    );

    await user.click(screen.getByRole('button', { name: /update/i }));

    expect(putItemData).toEqual({
      title: 'Lost Wallet XYZL',
      foundAt: 'On the dance floor',
      briefDescription: 'Brown leather wallet',
      staffDetails: 'This thing is packed with receipts and ketchup packets!',
      locationId: 169,
      category: 'clothing',
      dateFound: format(new Date(), 'yyyy-MM-dd'),
    });

    expect(
      screen.queryByRole('dialog', { name: /edit item/i })
    ).not.toBeInTheDocument();
  });
  it('allows users to delete an item', async () => {});
});

// describe('Dashboard with Stripe Subscription', () => {
//   it('allows users to subscribe to a plan', async () => {});
//   it('shows success message after subscription', async () => {});
//   it('allows access to billing portal for active subscribers');
//   it('shows subscription end date for canceled subscriptions');
//   it('handles failed checkout session creation');
//   it('handles failed billing portal access');
//   it('maintains access until subscription period ends');
//   it('shows upgrade button for expired subscriptions');
//   it('shows different navigation options based on subscription status');
//   it('preserves subscription state across page reloads');
// });
