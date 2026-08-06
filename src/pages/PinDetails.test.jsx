// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PinDetails from './PinDetails';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'pin-123' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../components/Header', () => ({ default: () => <div>Header</div> }));
vi.mock('../components/Footer', () => ({ default: () => <div>Footer</div> }));
vi.mock('../components/ScrollToTopButton', () => ({ default: () => <div /> }));
vi.mock('../components/ToastNotifications', () => ({
  ToastProvider: ({ children }) => <>{children}</>,
}));

describe('PinDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads a pin by id from the API when available', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        id: 'pin-123',
        title: 'Coastal sunset',
        description: 'A dreamy beach scene',
        imageUrl: 'https://example.com/pin.jpg',
        category: 'Travel',
        user: 'travel_june',
        userFullName: 'June Park',
      }),
    });

    render(
      <MemoryRouter>
        <PinDetails />
      </MemoryRouter>
    );

    expect(await screen.findByText('Coastal sunset')).toBeTruthy();
  });
});
