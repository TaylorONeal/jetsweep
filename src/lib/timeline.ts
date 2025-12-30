import { getAirportProfile, AirportProfile, TIER_DEFAULTS } from './airports';
import { analyzeTravelConditions, TravelConditions } from './travelConditions';

export interface FlightInputs {
  departureDateTime: Date;
  tripType: 'domestic' | 'international';
  hasPreCheck: boolean;
  hasClear: boolean;
  hasCheckedBag: boolean;
  airport?: string;
  groupType: 'solo' | 'family';
  transportType: 'rideshare' | 'car';
  isHoliday: boolean; // Manual override
  isBadWeather: boolean;
  riskPreference: 'early' | 'balanced' | 'risky';
  driveTime?: number; // Minutes from home to airport
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

export type StressLevel = 'CALM' | 'TIGHT' | 'RISKY';

export interface TimelineResult {
  stages: TimelineStage[];
  leaveTime: Date;
  leaveTimeRange: TimeRange;
  leaveTimeWindow: { earliest: Date; latest: Date };
  confidence: 'normal' | 'risky' | 'high-variance';
  airportProfile: AirportProfile;
  isAirportEstimate: boolean;
  isLeaveNow: boolean;
  travelConditions: TravelConditions;
  stressMargin: number; // minutes of buffer at gate
  stressLevel: StressLevel;
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

// Apply risk multiplier to get the buffer time from a range
// early = max, balanced = 75% between min and max, risky = min
function getRiskAdjustedTime(range: TimeRange, multiplier: number): number {
  return Math.round(range.min + (range.max - range.min) * multiplier);
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
    isHoliday: manualHoliday,
    isBadWeather,
    riskPreference,
    driveTime,
  } = inputs;

  const isInternational = tripType === 'international';
  const isFamily = groupType === 'family';
  const isRideshare = transportType === 'rideshare';

  // Analyze travel conditions (rush hour, holidays)
  const travelConditions = analyzeTravelConditions(departureDateTime);
  
  // Holiday is true if auto-detected OR manually set
  const isHoliday = manualHoliday || travelConditions.holidayImpact !== null;

  // Risk multiplier affects buffer times
  // early = use max times (1.0), balanced = use ~75% (0.75), risky = use min times (0.5)
  const riskMultiplier = riskPreference === 'early' ? 1.0 : riskPreference === 'balanced' ? 0.75 : 0.5;

  // Get airport profile
  const { profile: airportProfile, isEstimate: isAirportEstimate } = airport
    ? getAirportProfile(airport)
    : { profile: { ...TIER_DEFAULTS.GENERIC, code: 'GEN', name: 'Generic Airport', tier: 'GENERIC' as const, painPoint: 'Using default estimates' }, isEstimate: true };

  // Calculate confidence - include holiday impact severity
  const holidaySevere = travelConditions.holidayImpact?.severity === 'extreme' || travelConditions.holidayImpact?.severity === 'heavy';
  const modifierCount = [isHoliday, isBadWeather, isFamily, travelConditions.isRushHour].filter(Boolean).length;
  let confidence: TimelineResult['confidence'] = 'normal';
  if (modifierCount >= 2 || (isRideshare && isBadWeather) || holidaySevere) {
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

  // Gate arrival - apply risk multiplier
  const gateBufferBase: TimeRange = isInternational ? { min: 20, max: 30 } : { min: 15, max: 25 };
  const gateBufferMin = getRiskAdjustedTime(gateBufferBase, riskMultiplier);
  const gateArrival = subtractMinutes(boardingStart, gateBufferMin);
  const walkRange: TimeRange = isInternational 
    ? { min: Math.max(15, airportProfile.walk[0]), max: Math.max(25, airportProfile.walk[1]) }
    : { min: airportProfile.walk[0], max: airportProfile.walk[1] };
  const walkTime = getRiskAdjustedTime(walkRange, riskMultiplier);

  stages.unshift({
    id: 'gate',
    label: 'Gate Arrival',
    icon: 'door-open',
    startTime: subtractMinutes(gateArrival, walkTime),
    endTime: gateArrival,
    durationRange: walkRange,
    note: `${formatTimeRange(walkRange)} walk through terminal${airportProfile.painPoint ? `. ${airportProfile.painPoint}` : ''}`,
  });

  // Check if there's buffer for lounge/food
  const securityExitTarget = subtractMinutes(gateArrival, walkTime);

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

  // Apply holiday security multiplier if auto-detected
  if (travelConditions.holidayImpact && travelConditions.securityMultiplier !== 1.0) {
    securityBase = {
      min: Math.round(securityBase.min * travelConditions.securityMultiplier),
      max: Math.round(securityBase.max * travelConditions.securityMultiplier),
    };
  }

  const securityRange = applyModifiers(
    securityBase,
    manualHoliday && !travelConditions.holidayImpact, // Only apply manual holiday modifier if not auto-detected
    false, // weather doesn't affect security
    isFamily,
    { min: 10, max: 20 },
    { min: 0, max: 0 },
    { min: 5, max: 15 }
  );

  const securityEnd = securityExitTarget;
  const securityTime = getRiskAdjustedTime(securityRange, riskMultiplier);
  const securityStart = subtractMinutes(securityEnd, securityTime);

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

    const baggageTime = getRiskAdjustedTime(baggageRange, riskMultiplier);
    const baggageStart = subtractMinutes(securityStart, baggageTime);
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

  const curbTime = getRiskAdjustedTime(curbRange, riskMultiplier);
  const arrivalStart = subtractMinutes(arrivalTarget, curbTime);

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
    // Drive time to airport (rideshare drives you)
    const baseDriveTime = driveTime ?? airportProfile.typicalDriveTime;
    const actualDriveTime = Math.round(baseDriveTime * travelConditions.trafficMultiplier);
    const driveEnd = arrivalStart;
    const driveStart = subtractMinutes(driveEnd, actualDriveTime);

    const rushHourNote = travelConditions.isRushHour 
      ? ` (${travelConditions.rushHourSeverity === 'heavy' ? '+35%' : '+15%'} rush hour traffic)`
      : '';

    stages.unshift({
      id: 'drive',
      label: 'Drive to Airport',
      icon: 'navigation',
      startTime: driveStart,
      endTime: driveEnd,
      durationRange: { min: actualDriveTime, max: actualDriveTime },
      note: driveTime 
        ? `Your estimated drive time${rushHourNote}` 
        : `Typical ${baseDriveTime} min from city center${rushHourNote}—check Google/Apple Maps for your route`,
    });

    // Rideshare pickup (wait for driver)
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

    const pickupEnd = driveStart;
    const pickupTime = getRiskAdjustedTime(pickupRange, riskMultiplier);
    const pickupStart = subtractMinutes(pickupEnd, pickupTime);

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
    const callTime = getRiskAdjustedTime(callRange, riskMultiplier);
    const callStart = subtractMinutes(callEnd, callTime);

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
    const parkingTime = getRiskAdjustedTime(parkingRange, riskMultiplier);
    const parkingStart = subtractMinutes(parkingEnd, parkingTime);

    stages.unshift({
      id: 'parking',
      label: 'Park & Shuttle',
      icon: 'car',
      startTime: parkingStart,
      endTime: parkingEnd,
      durationRange: parkingRange,
      note: 'Find parking, take shuttle or walk to terminal',
    });

    // Drive time to airport (apply rush hour multiplier)
    const baseDriveTime = driveTime ?? airportProfile.typicalDriveTime;
    const actualDriveTime = Math.round(baseDriveTime * travelConditions.trafficMultiplier);
    const driveEnd = parkingStart;
    const driveStart = subtractMinutes(driveEnd, actualDriveTime);

    const rushHourNote = travelConditions.isRushHour 
      ? ` (${travelConditions.rushHourSeverity === 'heavy' ? '+35%' : '+15%'} rush hour traffic)`
      : '';

    stages.unshift({
      id: 'drive',
      label: 'Drive to Airport',
      icon: 'navigation',
      startTime: driveStart,
      endTime: driveEnd,
      durationRange: { min: actualDriveTime, max: actualDriveTime },
      note: driveTime 
        ? `Your estimated drive time${rushHourNote}` 
        : `Typical ${baseDriveTime} min from city center${rushHourNote}—check Google/Apple Maps for your route`,
    });

    // Head to car
    const headToCarRange: TimeRange = { min: 3, max: 5 };
    const headToCarTime = getRiskAdjustedTime(headToCarRange, riskMultiplier);
    stages.unshift({
      id: 'leave',
      label: 'Head to Car',
      icon: 'home',
      startTime: subtractMinutes(driveStart, headToCarTime),
      endTime: driveStart,
      durationRange: headToCarRange,
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

  // Calculate leave time window (earliest to latest)
  const leaveTimeEarliest = subtractMinutes(departureDateTime, totalMax);
  const leaveTimeLatest = subtractMinutes(departureDateTime, totalMin);

  // Calculate stress margin (time between gate arrival and boarding)
  const gateStage = stages.find(s => s.id === 'gate');
  const boardingStage = stages.find(s => s.id === 'boarding');
  const stressMargin = gateStage && boardingStage 
    ? Math.round((boardingStage.startTime.getTime() - gateStage.endTime.getTime()) / 60000)
    : 0;

  // Determine stress level
  let stressLevel: StressLevel = 'CALM';
  if (stressMargin < 10) {
    stressLevel = 'RISKY';
  } else if (stressMargin < 25) {
    stressLevel = 'TIGHT';
  }

  return {
    stages,
    leaveTime: isLeaveNow ? now : leaveTime,
    leaveTimeRange: { min: totalMin, max: totalMax },
    leaveTimeWindow: { earliest: leaveTimeEarliest, latest: leaveTimeLatest },
    confidence,
    airportProfile,
    isAirportEstimate,
    isLeaveNow,
    travelConditions,
    stressMargin,
    stressLevel,
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
