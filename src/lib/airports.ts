export interface AirportProfile {
  code: string;
  name: string;
  tier: 'MEGA' | 'LARGE' | 'MEDIUM' | 'GENERIC';
  walk: [number, number];
  curb: [number, number];
  parking: [number, number];
  rideshare: [number, number];
  securityAdd: [number, number];
  baggageAdd: [number, number];
  painPoint: string;
}

export const TOP_25_AIRPORTS: AirportProfile[] = [
  { code: 'ATL', name: 'Atlanta Hartsfield-Jackson', tier: 'MEGA', walk: [15, 30], curb: [8, 15], parking: [20, 35], rideshare: [10, 20], securityAdd: [5, 15], baggageAdd: [5, 12], painPoint: 'Massive terminal; long walks between concourses' },
  { code: 'LAX', name: 'Los Angeles International', tier: 'MEGA', walk: [12, 25], curb: [10, 18], parking: [18, 32], rideshare: [12, 25], securityAdd: [8, 18], baggageAdd: [5, 12], painPoint: 'Separated terminals; rideshare pickup congestion' },
  { code: 'ORD', name: "Chicago O'Hare", tier: 'MEGA', walk: [14, 28], curb: [7, 14], parking: [18, 30], rideshare: [8, 18], securityAdd: [6, 15], baggageAdd: [5, 12], painPoint: 'Weather delays; terminal transfers can be long' },
  { code: 'DFW', name: 'Dallas/Fort Worth', tier: 'MEGA', walk: [12, 25], curb: [6, 12], parking: [15, 28], rideshare: [8, 16], securityAdd: [4, 12], baggageAdd: [4, 10], painPoint: 'Sprawling layout; Skylink train adds time' },
  { code: 'DEN', name: 'Denver International', tier: 'MEGA', walk: [15, 30], curb: [8, 15], parking: [20, 35], rideshare: [10, 20], securityAdd: [5, 15], baggageAdd: [5, 12], painPoint: 'Very long walks; train to gates adds 8-12 min' },
  { code: 'JFK', name: 'New York JFK', tier: 'MEGA', walk: [10, 22], curb: [8, 15], parking: [18, 32], rideshare: [12, 25], securityAdd: [8, 18], baggageAdd: [6, 15], painPoint: 'Separate terminals; AirTrain connections slow' },
  { code: 'SFO', name: 'San Francisco International', tier: 'LARGE', walk: [10, 20], curb: [6, 12], parking: [15, 25], rideshare: [8, 16], securityAdd: [5, 12], baggageAdd: [4, 10], painPoint: 'International terminal far; fog delays common' },
  { code: 'SEA', name: 'Seattle-Tacoma', tier: 'LARGE', walk: [12, 22], curb: [5, 10], parking: [14, 25], rideshare: [7, 14], securityAdd: [4, 10], baggageAdd: [4, 10], painPoint: 'Satellite gates require train; busy mornings' },
  { code: 'LAS', name: 'Las Vegas Harry Reid', tier: 'LARGE', walk: [12, 24], curb: [6, 12], parking: [15, 28], rideshare: [8, 16], securityAdd: [5, 12], baggageAdd: [4, 10], painPoint: 'Long terminal walks; weekend surge crowds' },
  { code: 'MCO', name: 'Orlando International', tier: 'LARGE', walk: [14, 26], curb: [6, 12], parking: [15, 28], rideshare: [8, 16], securityAdd: [6, 14], baggageAdd: [5, 12], painPoint: 'Theme park crowds; long security lines' },
  { code: 'EWR', name: 'Newark Liberty', tier: 'LARGE', walk: [10, 20], curb: [7, 14], parking: [16, 28], rideshare: [10, 20], securityAdd: [6, 14], baggageAdd: [5, 12], painPoint: 'Terminal C congested; AirTrain unreliable' },
  { code: 'MIA', name: 'Miami International', tier: 'LARGE', walk: [12, 24], curb: [7, 14], parking: [16, 28], rideshare: [8, 18], securityAdd: [6, 14], baggageAdd: [5, 12], painPoint: 'Heavy international traffic; long customs lines' },
  { code: 'PHX', name: 'Phoenix Sky Harbor', tier: 'LARGE', walk: [10, 20], curb: [5, 10], parking: [12, 22], rideshare: [6, 14], securityAdd: [4, 10], baggageAdd: [3, 8], painPoint: 'Terminal 4 massive; PHX Sky Train adds time' },
  { code: 'IAH', name: 'Houston George Bush', tier: 'LARGE', walk: [12, 24], curb: [6, 12], parking: [15, 28], rideshare: [8, 16], securityAdd: [5, 12], baggageAdd: [4, 10], painPoint: 'Terminal changes common; Skyway train slow' },
  { code: 'BOS', name: 'Boston Logan', tier: 'LARGE', walk: [10, 18], curb: [6, 12], parking: [15, 26], rideshare: [8, 16], securityAdd: [5, 12], baggageAdd: [4, 10], painPoint: 'Cramped terminals; traffic congestion severe' },
  { code: 'MSP', name: 'Minneapolis-St. Paul', tier: 'LARGE', walk: [12, 22], curb: [5, 10], parking: [14, 25], rideshare: [6, 14], securityAdd: [4, 10], baggageAdd: [3, 8], painPoint: 'Concourse changes via tram; winter weather' },
  { code: 'DTW', name: 'Detroit Metro', tier: 'LARGE', walk: [14, 26], curb: [5, 10], parking: [14, 25], rideshare: [6, 14], securityAdd: [4, 10], baggageAdd: [3, 8], painPoint: 'McNamara terminal extremely long; express tram' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood', tier: 'MEDIUM', walk: [8, 16], curb: [5, 10], parking: [12, 22], rideshare: [6, 14], securityAdd: [4, 10], baggageAdd: [3, 8], painPoint: 'Terminals not connected; cruise traffic spikes' },
  { code: 'CLT', name: 'Charlotte Douglas', tier: 'LARGE', walk: [12, 24], curb: [5, 10], parking: [14, 25], rideshare: [6, 14], securityAdd: [4, 10], baggageAdd: [3, 8], painPoint: 'Hub congestion; long concourses' },
  { code: 'PHL', name: 'Philadelphia International', tier: 'LARGE', walk: [10, 20], curb: [6, 12], parking: [14, 26], rideshare: [7, 15], securityAdd: [5, 12], baggageAdd: [4, 10], painPoint: 'Aging infrastructure; terminals spread out' },
  { code: 'SAN', name: 'San Diego International', tier: 'MEDIUM', walk: [8, 14], curb: [4, 8], parking: [10, 18], rideshare: [5, 12], securityAdd: [3, 8], baggageAdd: [2, 6], painPoint: 'Single runway; terminal 2 more efficient' },
  { code: 'DCA', name: 'Washington Reagan National', tier: 'MEDIUM', walk: [8, 16], curb: [5, 10], parking: [12, 22], rideshare: [6, 14], securityAdd: [4, 10], baggageAdd: [3, 8], painPoint: 'Metro access good but gates far; tight security' },
  { code: 'IAD', name: 'Washington Dulles', tier: 'LARGE', walk: [14, 28], curb: [6, 12], parking: [18, 32], rideshare: [8, 18], securityAdd: [5, 12], baggageAdd: [4, 10], painPoint: 'Mobile lounges slow; very spread out' },
  { code: 'TPA', name: 'Tampa International', tier: 'MEDIUM', walk: [8, 14], curb: [4, 8], parking: [10, 18], rideshare: [5, 12], securityAdd: [2, 6], baggageAdd: [2, 6], painPoint: 'Well-designed; airsides via shuttle' },
  { code: 'BWI', name: 'Baltimore-Washington', tier: 'MEDIUM', walk: [10, 18], curb: [5, 10], parking: [12, 22], rideshare: [6, 14], securityAdd: [3, 8], baggageAdd: [3, 8], painPoint: 'Southwest hub; can get crowded' },
];

// Special "Other" options that use tier defaults
export const OTHER_AIRPORT_OPTIONS = [
  { code: 'OTHER_LARGE', name: 'Other (Large / International)', tier: 'LARGE' as const },
  { code: 'OTHER_REGIONAL', name: 'Other (Regional / Small)', tier: 'MEDIUM' as const },
];

export const TIER_DEFAULTS: Record<AirportProfile['tier'], Omit<AirportProfile, 'code' | 'name' | 'tier' | 'painPoint'>> = {
  GENERIC: {
    walk: [10, 20],
    curb: [5, 10],
    parking: [15, 30],
    rideshare: [6, 15],
    securityAdd: [3, 10],
    baggageAdd: [3, 10],
  },
  MEDIUM: {
    walk: [8, 16],
    curb: [4, 8],
    parking: [12, 22],
    rideshare: [5, 12],
    securityAdd: [2, 6],
    baggageAdd: [2, 6],
  },
  LARGE: {
    walk: [10, 22],
    curb: [5, 10],
    parking: [15, 30],
    rideshare: [6, 15],
    securityAdd: [3, 10],
    baggageAdd: [3, 10],
  },
  MEGA: {
    walk: [12, 28],
    curb: [7, 14],
    parking: [18, 35],
    rideshare: [8, 20],
    securityAdd: [5, 15],
    baggageAdd: [5, 15],
  },
};

export function findAirport(query: string): AirportProfile | null {
  if (!query) return null;
  const normalized = query.toUpperCase().trim();
  
  // Try exact IATA code match first
  const exactMatch = TOP_25_AIRPORTS.find(a => a.code === normalized);
  if (exactMatch) return exactMatch;
  
  // Try partial name match
  const nameMatch = TOP_25_AIRPORTS.find(a => 
    a.name.toUpperCase().includes(normalized) || 
    normalized.includes(a.code)
  );
  if (nameMatch) return nameMatch;
  
  return null;
}

export function inferAirportProfile(query: string, hasInternationalService: boolean = true): AirportProfile {
  const tier: AirportProfile['tier'] = hasInternationalService ? 'LARGE' : 'MEDIUM';
  const defaults = TIER_DEFAULTS[tier];
  
  return {
    code: query.toUpperCase().slice(0, 3) || 'UNK',
    name: query || 'Unknown Airport',
    tier,
    painPoint: 'Using estimated values based on airport size',
    ...defaults,
  };
}

export function getAirportProfile(query: string): { profile: AirportProfile; isEstimate: boolean } {
  // Handle special "Other" options
  if (query === 'OTHER_LARGE') {
    const defaults = TIER_DEFAULTS.LARGE;
    return {
      profile: {
        code: 'OTH',
        name: 'Other Large Airport',
        tier: 'LARGE',
        painPoint: 'Using estimates for large/international airports',
        ...defaults,
      },
      isEstimate: true,
    };
  }
  
  if (query === 'OTHER_REGIONAL') {
    const defaults = TIER_DEFAULTS.MEDIUM;
    return {
      profile: {
        code: 'REG',
        name: 'Regional Airport',
        tier: 'MEDIUM',
        painPoint: 'Using estimates for regional airports',
        ...defaults,
      },
      isEstimate: true,
    };
  }

  const found = findAirport(query);
  if (found) {
    return { profile: found, isEstimate: false };
  }
  
  return { 
    profile: inferAirportProfile(query), 
    isEstimate: true 
  };
}
