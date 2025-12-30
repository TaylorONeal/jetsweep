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
  typicalDriveTime: number;
}

// Top 100 US Airports → Tier mapping
const AIRPORT_TIER_MAP: Record<string, AirportProfile['tier']> = {
  // MEGA
  ATL: 'MEGA', LAX: 'MEGA', ORD: 'MEGA', DFW: 'MEGA', DEN: 'MEGA', JFK: 'MEGA',
  
  // LARGE
  CLT: 'LARGE', LAS: 'LARGE', MCO: 'LARGE', MIA: 'LARGE', PHX: 'LARGE', SEA: 'LARGE',
  IAH: 'LARGE', EWR: 'LARGE', SFO: 'LARGE', BOS: 'LARGE', DTW: 'LARGE', MSP: 'LARGE',
  LGA: 'LARGE', FLL: 'LARGE', BWI: 'LARGE', IAD: 'LARGE', SLC: 'LARGE', MDW: 'LARGE',
  TPA: 'LARGE', SAN: 'LARGE', HNL: 'LARGE', PDX: 'LARGE', BNA: 'LARGE', AUS: 'LARGE',
  RDU: 'LARGE',
  
  // MEDIUM
  SJC: 'MEDIUM', MCI: 'MEDIUM', CLE: 'MEDIUM', SMF: 'MEDIUM', PIT: 'MEDIUM',
  OAK: 'MEDIUM', CVG: 'MEDIUM', IND: 'MEDIUM', CMH: 'MEDIUM', HOU: 'MEDIUM',
  MKE: 'MEDIUM', SAT: 'MEDIUM', DAL: 'MEDIUM', JAX: 'MEDIUM', RSW: 'MEDIUM',
  ONT: 'MEDIUM', PBI: 'MEDIUM', MSY: 'MEDIUM', SNA: 'MEDIUM', BUR: 'MEDIUM',
  RNO: 'MEDIUM', OGG: 'MEDIUM', SDF: 'MEDIUM', CHS: 'MEDIUM', PNS: 'MEDIUM',
  
  // GENERIC
  TUS: 'GENERIC', OKC: 'GENERIC', ABQ: 'GENERIC', DSM: 'GENERIC', LGB: 'GENERIC',
  GEG: 'GENERIC', ELP: 'GENERIC', TUL: 'GENERIC', BOI: 'GENERIC', RIC: 'GENERIC',
  PSP: 'GENERIC', ORF: 'GENERIC', ALB: 'GENERIC', SAV: 'GENERIC', GSP: 'GENERIC',
  ROC: 'GENERIC', BUF: 'GENERIC', OMA: 'GENERIC', SYR: 'GENERIC', BHM: 'GENERIC',
  LIT: 'GENERIC', DAY: 'GENERIC', ICT: 'GENERIC', COS: 'GENERIC', PWM: 'GENERIC',
};

// Tier defaults
export const TIER_DEFAULTS: Record<AirportProfile['tier'], Omit<AirportProfile, 'code' | 'name' | 'tier' | 'painPoint'>> = {
  MEGA: {
    walk: [15, 25],
    curb: [20, 30],
    parking: [20, 30],
    rideshare: [25, 40],
    securityAdd: [20, 30],
    baggageAdd: [20, 30],
    typicalDriveTime: 35,
  },
  LARGE: {
    walk: [10, 20],
    curb: [15, 25],
    parking: [15, 25],
    rideshare: [15, 30],
    securityAdd: [15, 25],
    baggageAdd: [15, 25],
    typicalDriveTime: 25,
  },
  MEDIUM: {
    walk: [8, 15],
    curb: [10, 20],
    parking: [10, 20],
    rideshare: [10, 20],
    securityAdd: [10, 20],
    baggageAdd: [10, 20],
    typicalDriveTime: 20,
  },
  GENERIC: {
    walk: [5, 12],
    curb: [5, 15],
    parking: [5, 15],
    rideshare: [5, 15],
    securityAdd: [5, 15],
    baggageAdd: [5, 15],
    typicalDriveTime: 15,
  },
};

// Airport-specific overrides (applied on top of tier defaults)
const AIRPORT_OVERRIDES: Record<string, Partial<Pick<AirportProfile, 'curb' | 'rideshare' | 'securityAdd' | 'walk' | 'baggageAdd' | 'painPoint'>>> = {
  LAX: {
    curb: [25, 40],
    rideshare: [30, 45],
    painPoint: 'Curb and rideshare congestion dominate; security is rarely the bottleneck.',
  },
  JFK: {
    curb: [25, 40],
    rideshare: [30, 45],
    securityAdd: [25, 35],
    painPoint: 'Traffic variability and terminal differences make timing unreliable.',
  },
  EWR: {
    curb: [25, 40],
    rideshare: [30, 45],
    securityAdd: [25, 35],
    painPoint: 'Road access failures cause cascading delays.',
  },
  DEN: {
    securityAdd: [25, 40],
    walk: [20, 30],
    painPoint: 'Early-morning security surges are severe and sudden.',
  },
  SEA: {
    securityAdd: [25, 35],
    painPoint: 'Security bottlenecks form abruptly with little warning.',
  },
  ATL: {
    walk: [20, 30],
    securityAdd: [20, 30],
    painPoint: 'Train waits and sheer distance quietly add time.',
  },
  MCO: {
    baggageAdd: [25, 35],
    securityAdd: [25, 35],
    painPoint: 'Family travel and checked bags compound delays.',
  },
  LAS: {
    securityAdd: [20, 30],
    painPoint: 'Convention peaks overwhelm security unpredictably.',
  },
  BOS: {
    curb: [20, 30],
    painPoint: 'Road layout becomes confusing under pressure.',
  },
  ORD: {
    walk: [15, 30],
    painPoint: 'Construction and terminal sprawl introduce hidden delays.',
  },
};

// Airport name lookup
const AIRPORT_NAMES: Record<string, string> = {
  ATL: 'Atlanta Hartsfield-Jackson', LAX: 'Los Angeles International', ORD: "Chicago O'Hare",
  DFW: 'Dallas/Fort Worth', DEN: 'Denver International', JFK: 'New York JFK',
  CLT: 'Charlotte Douglas', LAS: 'Las Vegas Harry Reid', MCO: 'Orlando International',
  MIA: 'Miami International', PHX: 'Phoenix Sky Harbor', SEA: 'Seattle-Tacoma',
  IAH: 'Houston George Bush', EWR: 'Newark Liberty', SFO: 'San Francisco International',
  BOS: 'Boston Logan', DTW: 'Detroit Metro', MSP: 'Minneapolis-St. Paul',
  LGA: 'New York LaGuardia', FLL: 'Fort Lauderdale-Hollywood', BWI: 'Baltimore-Washington',
  IAD: 'Washington Dulles', SLC: 'Salt Lake City', MDW: 'Chicago Midway',
  TPA: 'Tampa International', SAN: 'San Diego International', HNL: 'Honolulu International',
  PDX: 'Portland International', BNA: 'Nashville International', AUS: 'Austin-Bergstrom',
  RDU: 'Raleigh-Durham', SJC: 'San Jose International', MCI: 'Kansas City International',
  CLE: 'Cleveland Hopkins', SMF: 'Sacramento International', PIT: 'Pittsburgh International',
  OAK: 'Oakland International', CVG: 'Cincinnati/Northern Kentucky', IND: 'Indianapolis International',
  CMH: 'Columbus John Glenn', HOU: 'Houston Hobby', MKE: 'Milwaukee Mitchell',
  SAT: 'San Antonio International', DAL: 'Dallas Love Field', JAX: 'Jacksonville International',
  RSW: 'Fort Myers Southwest Florida', ONT: 'Ontario International', PBI: 'Palm Beach International',
  MSY: 'New Orleans Louis Armstrong', SNA: 'Orange County John Wayne', BUR: 'Burbank Hollywood',
  RNO: 'Reno-Tahoe', OGG: 'Maui Kahului', SDF: 'Louisville International',
  CHS: 'Charleston International', PNS: 'Pensacola International', TUS: 'Tucson International',
  OKC: 'Oklahoma City Will Rogers', ABQ: 'Albuquerque Sunport', DSM: 'Des Moines International',
  LGB: 'Long Beach Airport', GEG: 'Spokane International', ELP: 'El Paso International',
  TUL: 'Tulsa International', BOI: 'Boise Airport', RIC: 'Richmond International',
  PSP: 'Palm Springs International', ORF: 'Norfolk International', ALB: 'Albany International',
  SAV: 'Savannah/Hilton Head', GSP: 'Greenville-Spartanburg', ROC: 'Rochester Greater',
  BUF: 'Buffalo Niagara', OMA: 'Omaha Eppley Airfield', SYR: 'Syracuse Hancock',
  BHM: 'Birmingham-Shuttlesworth', LIT: 'Little Rock National', DAY: 'Dayton International',
  ICT: 'Wichita Dwight D. Eisenhower', COS: 'Colorado Springs', PWM: 'Portland International Jetport',
};

// Special "Other" options that use tier defaults
export const OTHER_AIRPORT_OPTIONS = [
  { code: 'OTHER_LARGE', name: 'Other (Large / International)', tier: 'LARGE' as const },
  { code: 'OTHER_REGIONAL', name: 'Other (Regional / Small)', tier: 'MEDIUM' as const },
];

// Build airport profile from tier + overrides
function buildAirportProfile(code: string): AirportProfile {
  const tier = AIRPORT_TIER_MAP[code] || 'GENERIC';
  const defaults = TIER_DEFAULTS[tier];
  const overrides = AIRPORT_OVERRIDES[code] || {};
  const name = AIRPORT_NAMES[code] || code;
  
  return {
    code,
    name,
    tier,
    walk: overrides.walk || defaults.walk as [number, number],
    curb: overrides.curb || defaults.curb as [number, number],
    parking: defaults.parking as [number, number],
    rideshare: overrides.rideshare || defaults.rideshare as [number, number],
    securityAdd: overrides.securityAdd || defaults.securityAdd as [number, number],
    baggageAdd: overrides.baggageAdd || defaults.baggageAdd as [number, number],
    painPoint: overrides.painPoint || '',
    typicalDriveTime: defaults.typicalDriveTime,
  };
}

// Get all known airports for the dropdown (sorted alphabetically by code)
export function getAllAirports(): AirportProfile[] {
  return Object.keys(AIRPORT_TIER_MAP)
    .sort((a, b) => a.localeCompare(b))
    .map(code => buildAirportProfile(code));
}

export function findAirport(query: string): AirportProfile | null {
  if (!query) return null;
  const normalized = query.toUpperCase().trim();
  
  // Check if it's in the tier map
  if (AIRPORT_TIER_MAP[normalized]) {
    return buildAirportProfile(normalized);
  }
  
  // Try partial name match
  const nameMatch = Object.entries(AIRPORT_NAMES).find(([code, name]) => 
    name.toUpperCase().includes(normalized) || normalized.includes(code)
  );
  if (nameMatch) {
    return buildAirportProfile(nameMatch[0]);
  }
  
  return null;
}

export function inferAirportProfile(query: string): AirportProfile {
  const defaults = TIER_DEFAULTS.GENERIC;
  
  return {
    code: query.toUpperCase().slice(0, 3) || 'UNK',
    name: query || 'Unknown Airport',
    tier: 'GENERIC',
    painPoint: '',
    walk: defaults.walk as [number, number],
    curb: defaults.curb as [number, number],
    parking: defaults.parking as [number, number],
    rideshare: defaults.rideshare as [number, number],
    securityAdd: defaults.securityAdd as [number, number],
    baggageAdd: defaults.baggageAdd as [number, number],
    typicalDriveTime: defaults.typicalDriveTime,
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
        painPoint: '',
        walk: defaults.walk as [number, number],
        curb: defaults.curb as [number, number],
        parking: defaults.parking as [number, number],
        rideshare: defaults.rideshare as [number, number],
        securityAdd: defaults.securityAdd as [number, number],
        baggageAdd: defaults.baggageAdd as [number, number],
        typicalDriveTime: defaults.typicalDriveTime,
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
        painPoint: '',
        walk: defaults.walk as [number, number],
        curb: defaults.curb as [number, number],
        parking: defaults.parking as [number, number],
        rideshare: defaults.rideshare as [number, number],
        securityAdd: defaults.securityAdd as [number, number],
        baggageAdd: defaults.baggageAdd as [number, number],
        typicalDriveTime: defaults.typicalDriveTime,
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
