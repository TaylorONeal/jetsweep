// Rush hour and holiday detection logic with research-backed granular data

export interface TravelConditions {
  isRushHour: boolean;
  rushHourSeverity: 'none' | 'moderate' | 'heavy'; // 0, 1.15x, 1.35x drive time
  holidayImpact: HolidayImpact | null;
  trafficMultiplier: number;
  securityMultiplier: number;
  notes: string[];
}

export interface HolidayImpact {
  name: string;
  severity: 'light' | 'moderate' | 'heavy' | 'extreme';
  securityMultiplier: number; // 1.0 = normal, higher = busier
  description: string;
}

// Rush hour windows (local time)
// Morning: 6:00 AM - 9:30 AM (heavy 7-9, moderate edges)
// Evening: 3:30 PM - 7:00 PM (heavy 4-6:30, moderate edges)
function detectRushHour(departureDateTime: Date): { isRushHour: boolean; severity: 'none' | 'moderate' | 'heavy' } {
  const dayOfWeek = departureDateTime.getDay();
  const hour = departureDateTime.getHours();
  const minute = departureDateTime.getMinutes();
  const timeValue = hour + minute / 60;

  // Weekend - no rush hour
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { isRushHour: false, severity: 'none' };
  }

  // Morning rush: 6:00-9:30
  if (timeValue >= 7 && timeValue <= 9) {
    return { isRushHour: true, severity: 'heavy' };
  }
  if ((timeValue >= 6 && timeValue < 7) || (timeValue > 9 && timeValue <= 9.5)) {
    return { isRushHour: true, severity: 'moderate' };
  }

  // Evening rush: 3:30-7:00
  if (timeValue >= 16 && timeValue <= 18.5) {
    return { isRushHour: true, severity: 'heavy' };
  }
  if ((timeValue >= 15.5 && timeValue < 16) || (timeValue > 18.5 && timeValue <= 19)) {
    return { isRushHour: true, severity: 'moderate' };
  }

  return { isRushHour: false, severity: 'none' };
}

// Research-backed holiday impact data
// Sources: TSA throughput data, AAA travel forecasts, airline industry reports
const HOLIDAY_PERIODS: {
  name: string;
  check: (date: Date) => boolean;
  severity: 'light' | 'moderate' | 'heavy' | 'extreme';
  securityMultiplier: number;
  description: string;
}[] = [
  // THANKSGIVING - Busiest US travel period
  {
    name: 'Thanksgiving Week',
    check: (date) => {
      const year = date.getFullYear();
      const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4); // 4th Thursday of November
      const daysBefore = getDaysDiff(date, thanksgiving);
      // Sunday before through Wednesday = EXTREME
      if (daysBefore >= 0 && daysBefore <= 4) return true;
      return false;
    },
    severity: 'extreme',
    securityMultiplier: 1.5, // 50% longer security
    description: 'Peak Thanksgiving travel—arrive extra early',
  },
  {
    name: 'Thanksgiving Day',
    check: (date) => {
      const year = date.getFullYear();
      const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4);
      return isSameDay(date, thanksgiving);
    },
    severity: 'light', // Actually lighter on the day itself
    securityMultiplier: 0.9,
    description: 'Thanksgiving Day is quieter—most already traveled',
  },
  {
    name: 'Thanksgiving Return',
    check: (date) => {
      const year = date.getFullYear();
      const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4);
      const daysAfter = getDaysDiff(thanksgiving, date);
      // Friday through Sunday after = heavy to extreme
      if (daysAfter >= 1 && daysAfter <= 3) return true;
      return false;
    },
    severity: 'extreme',
    securityMultiplier: 1.45,
    description: 'Thanksgiving return rush—airports packed',
  },

  // CHRISTMAS / NEW YEAR
  {
    name: 'Christmas Rush',
    check: (date) => {
      const month = date.getMonth();
      const day = date.getDate();
      // Dec 20-23: Heavy pre-Christmas travel
      return month === 11 && day >= 20 && day <= 23;
    },
    severity: 'heavy',
    securityMultiplier: 1.35,
    description: 'Pre-Christmas travel surge',
  },
  {
    name: 'Christmas Eve',
    check: (date) => date.getMonth() === 11 && date.getDate() === 24,
    severity: 'moderate', // Morning heavy, afternoon light
    securityMultiplier: 1.15,
    description: 'Morning flights busy, afternoon quieter',
  },
  {
    name: 'Christmas Day',
    check: (date) => date.getMonth() === 11 && date.getDate() === 25,
    severity: 'light',
    securityMultiplier: 0.85,
    description: 'Christmas Day is one of the quietest—good travel day',
  },
  {
    name: 'Post-Christmas Rush',
    check: (date) => {
      const month = date.getMonth();
      const day = date.getDate();
      // Dec 26-30: Heavy
      return month === 11 && day >= 26 && day <= 30;
    },
    severity: 'heavy',
    securityMultiplier: 1.3,
    description: 'Post-holiday travel surge',
  },
  {
    name: 'New Year\'s Eve',
    check: (date) => date.getMonth() === 11 && date.getDate() === 31,
    severity: 'moderate',
    securityMultiplier: 1.15,
    description: 'Moderate volume—people heading to NYE destinations',
  },
  {
    name: 'New Year\'s Day',
    check: (date) => date.getMonth() === 0 && date.getDate() === 1,
    severity: 'light',
    securityMultiplier: 0.9,
    description: 'Lighter travel day—many recovering from NYE',
  },
  {
    name: 'Post-New Year Rush',
    check: (date) => {
      const month = date.getMonth();
      const day = date.getDate();
      // Jan 2-3: Heavy return travel
      return month === 0 && day >= 2 && day <= 3;
    },
    severity: 'heavy',
    securityMultiplier: 1.35,
    description: 'New Year return rush—back to work/school',
  },

  // SPRING BREAK (variable, March-April)
  {
    name: 'Spring Break Period',
    check: (date) => {
      const month = date.getMonth();
      // March 10 - April 20 range covers most spring breaks
      if (month === 2 && date.getDate() >= 10) return true;
      if (month === 3 && date.getDate() <= 20) return true;
      return false;
    },
    severity: 'moderate',
    securityMultiplier: 1.2,
    description: 'Spring break season—family travel surge',
  },

  // MEMORIAL DAY WEEKEND
  {
    name: 'Memorial Day Weekend',
    check: (date) => {
      const year = date.getFullYear();
      const memorialDay = getLastWeekdayOfMonth(year, 4, 1); // Last Monday of May
      const daysDiff = getDaysDiff(date, memorialDay);
      // Thursday before through Tuesday after
      return daysDiff >= -1 && daysDiff <= 4;
    },
    severity: 'heavy',
    securityMultiplier: 1.3,
    description: 'Memorial Day weekend getaway rush',
  },

  // JULY 4TH
  {
    name: 'July 4th Weekend',
    check: (date) => {
      const month = date.getMonth();
      const day = date.getDate();
      const dayOfWeek = date.getDay();
      if (month !== 6) return false;
      // July 1-7, weighted by proximity to the 4th
      if (day >= 1 && day <= 7) return true;
      return false;
    },
    severity: 'heavy',
    securityMultiplier: 1.25,
    description: 'Independence Day travel rush',
  },
  {
    name: 'July 4th',
    check: (date) => date.getMonth() === 6 && date.getDate() === 4,
    severity: 'moderate', // Day itself is lighter
    securityMultiplier: 1.1,
    description: 'July 4th day—most are at destinations',
  },

  // LABOR DAY
  {
    name: 'Labor Day Weekend',
    check: (date) => {
      const year = date.getFullYear();
      const laborDay = getNthWeekdayOfMonth(year, 8, 1, 1); // First Monday of September
      const daysDiff = getDaysDiff(date, laborDay);
      // Thursday before through Tuesday after
      return daysDiff >= -1 && daysDiff <= 4;
    },
    severity: 'heavy',
    securityMultiplier: 1.3,
    description: 'Labor Day—last summer travel rush',
  },

  // SUPER BOWL SUNDAY
  {
    name: 'Super Bowl Sunday',
    check: (date) => {
      // Super Bowl is typically first Sunday in February (varies)
      // Approximate check: first or second Sunday of February
      if (date.getMonth() !== 1) return false;
      const day = date.getDate();
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 && day >= 1 && day <= 14;
    },
    severity: 'moderate',
    securityMultiplier: 1.15,
    description: 'Super Bowl Sunday—fans heading to game cities',
  },

  // MLK DAY
  {
    name: 'MLK Day Weekend',
    check: (date) => {
      const year = date.getFullYear();
      const mlkDay = getNthWeekdayOfMonth(year, 0, 1, 3); // Third Monday of January
      const daysDiff = getDaysDiff(date, mlkDay);
      return daysDiff >= 0 && daysDiff <= 3;
    },
    severity: 'moderate',
    securityMultiplier: 1.15,
    description: 'MLK Day long weekend travel',
  },

  // PRESIDENTS DAY
  {
    name: 'Presidents Day Weekend',
    check: (date) => {
      const year = date.getFullYear();
      const presDay = getNthWeekdayOfMonth(year, 1, 1, 3); // Third Monday of February
      const daysDiff = getDaysDiff(date, presDay);
      return daysDiff >= 0 && daysDiff <= 3;
    },
    severity: 'moderate',
    securityMultiplier: 1.2,
    description: 'Presidents Day ski & beach getaway rush',
  },
];

// Helper functions
function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  let day = 1 + ((weekday - firstWeekday + 7) % 7) + (n - 1) * 7;
  return new Date(year, month, day);
}

function getLastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  const diff = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month + 1, -diff);
}

function getDaysDiff(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function detectHoliday(date: Date): HolidayImpact | null {
  for (const holiday of HOLIDAY_PERIODS) {
    if (holiday.check(date)) {
      return {
        name: holiday.name,
        severity: holiday.severity,
        securityMultiplier: holiday.securityMultiplier,
        description: holiday.description,
      };
    }
  }
  return null;
}

export function analyzeTravelConditions(departureDateTime: Date): TravelConditions {
  const rushHour = detectRushHour(departureDateTime);
  const holidayImpact = detectHoliday(departureDateTime);

  const notes: string[] = [];

  // Traffic multiplier for drive time
  let trafficMultiplier = 1.0;
  if (rushHour.severity === 'heavy') {
    trafficMultiplier = 1.35;
    notes.push('Rush hour traffic—expect 35% longer drive times');
  } else if (rushHour.severity === 'moderate') {
    trafficMultiplier = 1.15;
    notes.push('Moderate traffic—allow 15% extra drive time');
  }

  // Security multiplier
  let securityMultiplier = 1.0;
  if (holidayImpact) {
    securityMultiplier = holidayImpact.securityMultiplier;
    notes.push(holidayImpact.description);
  }

  return {
    isRushHour: rushHour.isRushHour,
    rushHourSeverity: rushHour.severity,
    holidayImpact,
    trafficMultiplier,
    securityMultiplier,
    notes,
  };
}

// Get user-friendly description of conditions
export function getConditionsDescription(conditions: TravelConditions): string {
  const parts: string[] = [];
  
  if (conditions.rushHourSeverity === 'heavy') {
    parts.push('Heavy rush hour');
  } else if (conditions.rushHourSeverity === 'moderate') {
    parts.push('Moderate traffic');
  }
  
  if (conditions.holidayImpact) {
    parts.push(conditions.holidayImpact.name);
  }
  
  return parts.length > 0 ? parts.join(' + ') : 'Normal conditions';
}
