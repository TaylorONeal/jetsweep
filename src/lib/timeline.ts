import { getAirportProfile, AirportProfile, TIER_DEFAULTS } from './airports';

export interface FlightInputs {
  departureDateTime: Date;
  tripType: 'domestic' | 'international';
  hasPreCheck: boolean;
  hasClear: boolean;
  hasCheckedBag: boolean;
  airport?: string;
  groupType: 'solo' | 'family';
  transportType: 'rideshare' | 'car';
  isHoliday: boolean;
  isBadWeather: boolean;
}

export interface TimeRange {
  min: number;
  max: number;
}

export interface TimelineStage {
  id: string;
  label: string;
  icon: string;
  startTime: Date;
  endTime: Date;
  durationRange: TimeRange;
  note: string;
  isOptional?: boolean;
}

export interface TimelineResult {
  stages: TimelineStage[];
  leaveTime: Date;
  leaveTimeRange: TimeRange;
  confidence: 'normal' | 'risky' | 'high-variance';
  airportProfile: AirportProfile;
  isAirportEstimate: boolean;
  isLeaveNow: boolean;
}

function addRange(a: TimeRange, b: TimeRange): TimeRange {
  return { min: a.min + b.min, max: a.max + b.max };
}

function applyModifiers(
  base: TimeRange,
  isHoliday: boolean,
  isBadWeather: boolean,
  isFamily: boolean,
  holidayRange: TimeRange = { min: 10, max: 20 },
  weatherRange: TimeRange = { min: 5, max: 15 },
  familyRange: TimeRange = { min: 5, max: 15 }
): TimeRange {
  let result = { ...base };
  if (isHoliday) result = addRange(result, holidayRange);
  if (isBadWeather) result = addRange(result, weatherRange);
  if (isFamily) result = addRange(result, familyRange);
  return result;
}

function subtractMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60 * 1000);
}

function formatTimeRange(range: TimeRange): string {
  if (range.min === range.max) return `${range.min} min`;
  return `${range.min}–${range.max} min`;
}

export function computeTimeline(inputs: FlightInputs): TimelineResult {
  const {
    departureDateTime,
    tripType,
    hasPreCheck,
    hasClear,
    hasCheckedBag,
    airport,
    groupType,
    transportType,
    isHoliday,
    isBadWeather,
  } = inputs;

  const isInternational = tripType === 'international';
  const isFamily = groupType === 'family';
  const isRideshare = transportType === 'rideshare';

  // Get airport profile
  const { profile: airportProfile, isEstimate: isAirportEstimate } = airport
    ? getAirportProfile(airport)
    : { profile: { ...TIER_DEFAULTS.GENERIC, code: 'GEN', name: 'Generic Airport', tier: 'GENERIC' as const, painPoint: 'Using default estimates' }, isEstimate: true };

  // Calculate confidence
  const modifierCount = [isHoliday, isBadWeather, isFamily].filter(Boolean).length;
  let confidence: TimelineResult['confidence'] = 'normal';
  if (modifierCount >= 2 || (isRideshare && isBadWeather)) {
    confidence = 'high-variance';
  } else if (modifierCount === 1) {
    confidence = 'risky';
  }

  // Work backwards from departure
  const stages: TimelineStage[] = [];

  // Boarding
  const boardingStartOffset = isInternational ? 50 : 40;
  const boardingStart = subtractMinutes(departureDateTime, boardingStartOffset);
  const boardingEnd = subtractMinutes(departureDateTime, boardingStartOffset - 20);

  stages.unshift({
    id: 'boarding',
    label: 'Boarding',
    icon: 'plane',
    startTime: boardingStart,
    endTime: boardingEnd,
    durationRange: { min: 15, max: 20 },
    note: isInternational 
      ? 'International flights board earlier; have passport ready' 
      : 'Be at gate when boarding starts for overhead bin space',
  });

  // Gate arrival
  const gateBufferMin = isInternational ? 30 : 20;
  const gateArrival = subtractMinutes(boardingStart, gateBufferMin);
  const walkRange: TimeRange = isInternational 
    ? { min: Math.max(15, airportProfile.walk[0]), max: Math.max(25, airportProfile.walk[1]) }
    : { min: airportProfile.walk[0], max: airportProfile.walk[1] };

  stages.unshift({
    id: 'gate',
    label: 'Gate Arrival',
    icon: 'door-open',
    startTime: subtractMinutes(gateArrival, walkRange.max),
    endTime: gateArrival,
    durationRange: walkRange,
    note: `${formatTimeRange(walkRange)} walk through terminal${airportProfile.painPoint ? `. ${airportProfile.painPoint}` : ''}`,
  });

  // Check if there's buffer for lounge/food
  const securityExitTarget = subtractMinutes(gateArrival, walkRange.max);

  // Security
  let securityBase: TimeRange;
  if (hasClear && hasPreCheck) {
    securityBase = { min: 5, max: 15 };
  } else if (hasClear) {
    securityBase = { min: 15, max: 30 };
  } else if (hasPreCheck) {
    securityBase = { min: 10, max: 20 };
  } else {
    securityBase = { min: 25, max: 45 };
  }

  // Add airport security modifier
  securityBase = addRange(securityBase, { 
    min: airportProfile.securityAdd[0], 
    max: airportProfile.securityAdd[1] 
  });

  const securityRange = applyModifiers(
    securityBase,
    isHoliday,
    false, // weather doesn't affect security
    isFamily,
    { min: 10, max: 20 },
    { min: 0, max: 0 },
    { min: 5, max: 15 }
  );

  const securityEnd = securityExitTarget;
  const securityStart = subtractMinutes(securityEnd, securityRange.max);

  stages.unshift({
    id: 'security',
    label: 'Security Screening',
    icon: 'shield-check',
    startTime: securityStart,
    endTime: securityEnd,
    durationRange: securityRange,
    note: hasPreCheck && hasClear 
      ? 'CLEAR + PreCheck: fastest lane available'
      : hasPreCheck 
        ? 'PreCheck: keep shoes on, laptop in bag'
        : hasClear 
          ? 'CLEAR: biometric skip to front of line'
          : 'Standard screening: liquids out, shoes off',
  });

  // Baggage check-in (if applicable)
  let baggageEnd = securityStart;
  if (hasCheckedBag) {
    const baggageBase: TimeRange = isInternational 
      ? { min: 30, max: 50 }
      : { min: 20, max: 35 };
    
    const baggageAirportAdd = {
      min: airportProfile.baggageAdd[0],
      max: airportProfile.baggageAdd[1],
    };

    const baggageRange = applyModifiers(
      addRange(baggageBase, baggageAirportAdd),
      isHoliday,
      false,
      isFamily,
      { min: 10, max: 15 },
      { min: 0, max: 0 },
      { min: 5, max: 10 }
    );

    const baggageStart = subtractMinutes(securityStart, baggageRange.max);
    baggageEnd = securityStart;

    stages.unshift({
      id: 'baggage',
      label: 'Baggage Check-in',
      icon: 'luggage',
      startTime: baggageStart,
      endTime: baggageEnd,
      durationRange: baggageRange,
      note: isInternational 
        ? 'International bags require extra verification; arrive at counter early'
        : 'Drop bag at counter or use self-service kiosk if available',
    });
  }

  // Airport arrival (curb to inside)
  const arrivalTarget = hasCheckedBag 
    ? subtractMinutes(stages.find(s => s.id === 'baggage')!.startTime, 0)
    : securityStart;

  const curbRange: TimeRange = {
    min: airportProfile.curb[0],
    max: airportProfile.curb[1],
  };

  const arrivalStart = subtractMinutes(arrivalTarget, curbRange.max);

  stages.unshift({
    id: 'arrival',
    label: 'Airport Arrival',
    icon: 'map-pin',
    startTime: arrivalStart,
    endTime: arrivalTarget,
    durationRange: curbRange,
    note: 'Curbside to terminal entrance',
  });

  // Transport
  if (isRideshare) {
    // Rideshare pickup
    const pickupBase: TimeRange = { min: 8, max: 15 };
    const pickupAirportAdd: TimeRange = {
      min: airportProfile.rideshare[0] - 6,
      max: airportProfile.rideshare[1] - 6,
    };
    const pickupRange = applyModifiers(
      addRange(pickupBase, { min: Math.max(0, pickupAirportAdd.min), max: Math.max(0, pickupAirportAdd.max) }),
      isHoliday,
      isBadWeather,
      false,
      { min: 5, max: 10 },
      { min: 10, max: 20 },
      { min: 0, max: 0 }
    );

    const pickupEnd = arrivalStart;
    const pickupStart = subtractMinutes(pickupEnd, pickupRange.max);

    stages.unshift({
      id: 'pickup',
      label: 'Rideshare Pickup',
      icon: 'car',
      startTime: pickupStart,
      endTime: pickupEnd,
      durationRange: pickupRange,
      note: isBadWeather 
        ? 'Weather delays likely; expect longer wait for driver'
        : 'Wait time varies; driver matching and arrival',
    });

    // Call rideshare
    const callRange: TimeRange = { min: 2, max: 5 };
    const callEnd = pickupStart;
    const callStart = subtractMinutes(callEnd, callRange.max);

    stages.unshift({
      id: 'call',
      label: 'Call Rideshare',
      icon: 'smartphone',
      startTime: callStart,
      endTime: callEnd,
      durationRange: callRange,
      note: 'Open app and request ride; have address ready',
    });
  } else {
    // Personal car
    const parkingBase: TimeRange = { min: 15, max: 30 };
    const parkingAirportAdd: TimeRange = {
      min: airportProfile.parking[0] - 15,
      max: airportProfile.parking[1] - 15,
    };
    const parkingRange = applyModifiers(
      addRange(parkingBase, { min: Math.max(0, parkingAirportAdd.min), max: Math.max(0, parkingAirportAdd.max) }),
      isHoliday,
      isBadWeather,
      false,
      { min: 5, max: 15 },
      { min: 10, max: 25 },
      { min: 0, max: 0 }
    );

    const parkingEnd = arrivalStart;
    const parkingStart = subtractMinutes(parkingEnd, parkingRange.max);

    stages.unshift({
      id: 'parking',
      label: 'Park & Shuttle',
      icon: 'car',
      startTime: parkingStart,
      endTime: parkingEnd,
      durationRange: parkingRange,
      note: 'Find parking, take shuttle or walk to terminal',
    });

    // Head to car
    stages.unshift({
      id: 'leave',
      label: 'Head to Car',
      icon: 'home',
      startTime: subtractMinutes(parkingStart, 5),
      endTime: parkingStart,
      durationRange: { min: 3, max: 5 },
      note: 'Final check: ID, phone, charger, bags',
    });
  }

  // Calculate leave time
  const leaveTime = stages[0].startTime;
  const now = new Date();
  const isLeaveNow = leaveTime <= now;

  // Calculate total range
  const totalMin = stages.reduce((sum, s) => sum + s.durationRange.min, 0);
  const totalMax = stages.reduce((sum, s) => sum + s.durationRange.max, 0);

  return {
    stages,
    leaveTime: isLeaveNow ? now : leaveTime,
    leaveTimeRange: { min: totalMin, max: totalMax },
    confidence,
    airportProfile,
    isAirportEstimate,
    isLeaveNow,
  };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

export function formatTimeRangeDisplay(start: Date, end: Date): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}
