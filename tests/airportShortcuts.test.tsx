import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, beforeEach } from 'vitest';
import { Geolocation } from '@capacitor/geolocation';
import { AirportShortcuts } from '../src/components/AirportShortcuts';
import { FlightForm } from '../src/components/FlightForm';
import { saveAirportPreference } from '../src/lib/airportPreferences';
vi.mock('@capacitor/geolocation', () => ({ Geolocation: { getCurrentPosition: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());
it('requests location only on tap and requires confirmation before selecting', async () => {
  vi.mocked(Geolocation.getCurrentPosition).mockResolvedValue({ coords: { latitude: 40.75, longitude: -73.98, accuracy: 100 } } as Awaited<ReturnType<typeof Geolocation.getCurrentPosition>>);
  const select = vi.fn();
  render(<AirportShortcuts airport="LAX" onSelect={select} />);
  expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Use my location' }));
  await screen.findByRole('button', { name: /LGA.*LaGuardia/ });
  expect(select).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: /LGA.*LaGuardia/ }));
  expect(select).toHaveBeenCalledWith('LGA');
});
it('leaves airport selection available when permission is denied', async () => {
  vi.mocked(Geolocation.getCurrentPosition).mockRejectedValue({ code: 1 });
  const select = vi.fn();
  render(<AirportShortcuts airport="LAX" onSelect={select} />);
  await userEvent.click(screen.getByRole('button', { name: 'Use my location' }));
  expect(await screen.findByRole('status')).toHaveTextContent('permission was denied');
  expect(select).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Use my location' })).toBeEnabled();
});
it('keeps a reopened trip airport and drive time ahead of defaults', () => {
  saveAirportPreference('defaultAirport', 'LAX');
  render(<FlightForm onSubmit={vi.fn()} initialInputs={{ airport: 'BOS', driveTime: 62 }} />);
  expect(screen.getByLabelText('Departure airport')).toHaveValue('BOS');
});
it('starts new plans with the saved default airport', () => {
  saveAirportPreference('defaultAirport', 'LAX');
  render(<FlightForm onSubmit={vi.fn()} />);
  expect(screen.getByLabelText('Departure airport')).toHaveValue('LAX');
});
