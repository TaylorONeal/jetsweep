// Recent searches storage using localStorage

export interface RecentSearch {
  id: string;
  airport: string;
  airportName: string;
  tripType: 'domestic' | 'international';
  leaveTime: string; // ISO string
  flightTime: string; // ISO string
  createdAt: string; // ISO string
}

const STORAGE_KEY = 'jetsweep_recent_searches';
const MAX_SEARCHES = 5;

export function saveRecentSearch(search: Omit<RecentSearch, 'id' | 'createdAt'>): void {
  const searches = getRecentSearches();
  
  const newSearch: RecentSearch = {
    ...search,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  // Add to front, remove duplicates for same airport/trip type combo
  const filtered = searches.filter(
    s => !(s.airport === search.airport && s.tripType === search.tripType)
  );
  
  const updated = [newSearch, ...filtered].slice(0, MAX_SEARCHES);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save recent search:', e);
  }
}

export function getRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as RecentSearch[];
  } catch (e) {
    console.error('Failed to load recent searches:', e);
    return [];
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear recent searches:', e);
  }
}

export function formatRecentSearchTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
