import { getAllAirports, OTHER_AIRPORT_OPTIONS } from './airports';
import { getRecentSearches } from './recentSearches';

const KEY = 'jetsweep_airport_preferences';
const codes = new Set([...getAllAirports(), ...OTHER_AIRPORT_OPTIONS].map(a => a.code));
export interface AirportPreferences { defaultAirport: string; lastAirport: string }
export function readAirportPreferences(): AirportPreferences {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return {
      defaultAirport: codes.has(value?.defaultAirport) ? value.defaultAirport : '',
      lastAirport: codes.has(value?.lastAirport) ? value.lastAirport : '',
    };
  } catch { return { defaultAirport: '', lastAirport: '' }; }
}
export function saveAirportPreference(key: keyof AirportPreferences, code: string): boolean {
  if (code && !codes.has(code)) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readAirportPreferences(), [key]: code }));
    return true;
  } catch { return false; }
}
export function preferredAirport(): string {
  const saved = readAirportPreferences();
  return saved.defaultAirport || saved.lastAirport ||
    getRecentSearches().find(trip => codes.has(trip.airport))?.airport || '';
}
export function clearAirportPreferences(): boolean {
  try { localStorage.removeItem(KEY); return true; } catch { return false; }
}
