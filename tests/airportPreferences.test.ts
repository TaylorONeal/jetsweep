// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { clearAirportPreferences, preferredAirport, readAirportPreferences, saveAirportPreference } from '../src/lib/airportPreferences';
import { findNearbyAirports } from '../src/lib/nearbyAirports';
import { getAllAirports } from '../src/lib/airports';
import coordinates from '../src/lib/airportCoordinates.json';
import { saveRecentSearch } from '../src/lib/recentSearches';

it('prefers a default, then last selection, and clears both', () => {
  saveAirportPreference('defaultAirport', 'LAX');
  saveAirportPreference('lastAirport', 'JFK');
  expect(preferredAirport()).toBe('LAX');
  saveAirportPreference('defaultAirport', '');
  expect(preferredAirport()).toBe('JFK');
  clearAirportPreferences();
  expect(preferredAirport()).toBe('');
});
it('falls back to the most recent completed trip for existing users', () => {
  saveRecentSearch({ airport: 'BOS', airportName: 'Boston', tripType: 'domestic', leaveTime: '2030-01-01T10:00:00Z', flightTime: '2030-01-01T12:00:00Z' });
  expect(preferredAirport()).toBe('BOS');
});
it('ignores corrupted and unknown saved airport codes', () => {
  localStorage.setItem('jetsweep_airport_preferences', 'null');
  expect(readAirportPreferences().defaultAirport).toBe('');
  localStorage.setItem('jetsweep_airport_preferences', '{"defaultAirport":"NOT_REAL"}');
  expect(preferredAirport()).toBe('');
  expect(saveAirportPreference('defaultAirport', 'NOT_REAL')).toBe(false);
});
it('reports unavailable storage without breaking planning', () => {
  const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('full'); });
  expect(saveAirportPreference('defaultAirport', 'LAX')).toBe(false);
  spy.mockRestore();
});
it('covers every supported airport with unique, in-range coordinates', () => {
  expect(coordinates.map(a => a.code).sort()).toEqual(getAllAirports().map(a => a.code).sort());
  for (const point of coordinates) {
    expect(Math.abs(point.latitude)).toBeLessThanOrEqual(90);
    expect(Math.abs(point.longitude)).toBeLessThanOrEqual(180);
    expect(findNearbyAirports(point.latitude, point.longitude)[0].code).toBe(point.code);
  }
});
it('ranks NYC alternatives and never suggests distant US airports abroad', () => {
  const nearby = findNearbyAirports(40.75, -73.98);
  expect(nearby[0].code).toBe('LGA');
  expect(nearby.map(a => a.code).sort()).toEqual(['EWR', 'JFK', 'LGA']);
  expect(findNearbyAirports(-8.7, 115.2)).toEqual([]);
  expect(findNearbyAirports(NaN, 0)).toEqual([]);
  expect(findNearbyAirports(95, 200)).toEqual([]);
});
