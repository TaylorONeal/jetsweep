import type { FlightInputs } from "./timeline";
import { z } from "zod";

// Recent searches storage using localStorage

export interface RecentSearch {
  inputs?: Omit<FlightInputs, "departureDateTime">;
  id: string;
  airport: string;
  airportName: string;
  tripType: "domestic" | "international";
  leaveTime: string; // ISO string
  flightTime: string; // ISO string
  createdAt: string; // ISO string
}

const STORAGE_KEY = "jetsweep_recent_searches";
const MAX_SEARCHES = 5;

export function saveRecentSearch(
  search: Omit<RecentSearch, "id" | "createdAt">,
): void {
  const searches = getRecentSearches();

  const newSearch: RecentSearch = {
    ...search,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  // Add to front, remove duplicates for same airport/trip type combo
  const filtered = searches.filter(
    (s) => !(s.airport === search.airport && s.tripType === search.tripType),
  );

  const updated = [newSearch, ...filtered].slice(0, MAX_SEARCHES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save recent search:", e);
  }
}

export function getRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const inputSchema = z.object({
      airport: z.string().optional(),
      tripType: z.enum(["domestic", "international"]),
      hasPreCheck: z.boolean(),
      hasClear: z.boolean(),
      hasCheckedBag: z.boolean(),
      groupType: z.enum(["solo", "family"]),
      transportType: z.enum(["rideshare", "car"]),
      isHoliday: z.boolean(),
      isBadWeather: z.boolean(),
      riskPreference: z.enum(["early", "balanced", "risky"]),
      driveTime: z.number().int().min(1).max(360).optional(),
    });
    const schema = z.object({
      id: z.string(),
      airport: z.string(),
      airportName: z.string(),
      tripType: z.enum(["domestic", "international"]),
      leaveTime: z.string().datetime(),
      flightTime: z.string().datetime(),
      createdAt: z.string().datetime(),
      inputs: inputSchema.optional(),
    });
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .flatMap((item) => {
        const result = schema.safeParse(item);
        return result.success ? [result.data as RecentSearch] : [];
      })
      .slice(0, MAX_SEARCHES);
  } catch (e) {
    console.error("Failed to load recent searches:", e);
    return [];
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear recent searches:", e);
  }
}

export function formatRecentSearchTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
