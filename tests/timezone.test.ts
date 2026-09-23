// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { parseLocalDeparture, toLocalDate } from '../src/lib/flightValidation';
import { computeTimeline, type FlightInputs } from '../src/lib/timeline';
import { getRecentSearches, saveRecentSearch } from '../src/lib/recentSearches';

const timezone = process.env.JETSWEEP_TEST_TIMEZONE;
const inputs: Omit<FlightInputs, 'departureDateTime'> = {
  airport: 'JFK', tripType: 'domestic', hasPreCheck: false, hasClear: false,
  hasCheckedBag: true, groupType: 'solo', transportType: 'car',
  isHoliday: false, isBadWeather: false, riskPreference: 'balanced', driveTime: 55,
};

describe('departure dates across device timezones', () => {
  it('retains the selected local day through ISO storage around midnight', () => {
    for (const time of ['00:15', '23:45']) {
      const departure = parseLocalDeparture('2030-06-10', time);
      saveRecentSearch({ airport: 'JFK', airportName: 'JFK', tripType: 'domestic',
        inputs, flightTime: departure.toISOString(), leaveTime: departure.toISOString() });
      const restored = new Date(getRecentSearches()[0].flightTime);
      expect(restored.getTime()).toBe(departure.getTime());
      expect(toLocalDate(restored)).toBe('2030-06-10');
      expect(restored.getHours()).toBe(Number(time.slice(0, 2)));
      expect(restored.getMinutes()).toBe(Number(time.slice(3)));
    }
  });

  it('puts an early-morning flight departure plan on the preceding local day', () => {
    const departureDateTime = parseLocalDeparture('2030-06-10', '00:30');
    const result = computeTimeline({ ...inputs, departureDateTime }, new Date('2030-06-01T00:00:00Z'));
    expect(toLocalDate(result.leaveTime)).toBe('2030-06-09');
    expect(result.leaveTime.getTime()).toBeLessThan(departureDateTime.getTime());
    for (let i = 1; i < result.stages.length; i++) {
      expect(result.stages[i].startTime.getTime()).toBeGreaterThanOrEqual(result.stages[i - 1].endTime.getTime());
    }
  });

  it.skipIf(!timezone)('runs in the requested timezone with its actual seasonal offsets', () => {
    const offsets: Record<string, [number, number]> = {
      UTC: [0, 0], 'America/New_York': [300, 240],
      'Europe/London': [0, -60], 'Asia/Makassar': [-480, -480],
    };
    expect([new Date(2030, 0, 15).getTimezoneOffset(), new Date(2030, 6, 15).getTimezoneOffset()])
      .toEqual(offsets[timezone!]);
  });

  it.skipIf(!timezone)('rejects spring-forward gaps only in zones where that wall time does not exist', () => {
    const usGap = parseLocalDeparture('2030-03-10', '02:30');
    const ukGap = parseLocalDeparture('2030-03-31', '01:30');
    expect(Number.isNaN(usGap.getTime())).toBe(timezone === 'America/New_York');
    expect(Number.isNaN(ukGap.getTime())).toBe(timezone === 'Europe/London');
  });
});
