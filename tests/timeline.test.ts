// @vitest-environment node
import { formatCountdown } from '../src/lib/timeDisplay';
import { describe, expect, it } from "vitest";
import { computeTimeline, FlightInputs } from "../src/lib/timeline";
import { validateFlight, toLocalDate } from "../src/lib/flightValidation";
import { getRecentSearches, saveRecentSearch } from "../src/lib/recentSearches";
import { analyzeTravelConditions } from "../src/lib/travelConditions";
const base: FlightInputs = {
  departureDateTime: new Date(2030, 1, 12, 12),
  airport: "ATL",
  tripType: "domestic",
  hasPreCheck: false,
  hasClear: false,
  hasCheckedBag: false,
  groupType: "solo",
  transportType: "rideshare",
  isHoliday: false,
  isBadWeather: false,
  riskPreference: "balanced",
  driveTime: 30,
};
const now = new Date(2030, 1, 1);
describe("planning invariants", () => {
  for (const airport of ["ATL", "LAX", "ORD", "OTHER", undefined]) {
    for (const riskPreference of ["early", "balanced", "risky"] as const) {
      for (const transportType of ["rideshare", "car"] as const) {
        it(`${airport} / ${riskPreference} / ${transportType} keeps the recommendation within its full window`, () => {
          const result = computeTimeline(
            {
              ...base,
              airport,
              riskPreference,
              transportType,
              hasCheckedBag: true,
            },
            now,
          );
          expect(result.leaveTime.getTime()).toBeGreaterThanOrEqual(
            result.leaveTimeWindow.earliest.getTime(),
          );
          expect(result.leaveTime.getTime()).toBeLessThanOrEqual(
            result.leaveTimeWindow.latest.getTime(),
          );
          expect(result.leaveTime).toEqual(result.stages[0].startTime);
          for (let i = 0; i < result.stages.length; i++) {
            const stage = result.stages[i];
            expect(stage.endTime.getTime()).toBeGreaterThan(
              stage.startTime.getTime(),
            );
            if (i)
              expect(stage.startTime.getTime()).toBeGreaterThanOrEqual(
                result.stages[i - 1].endTime.getTime(),
              );
          }
        });
      }
    }
  }
  it("preserves an overdue recommendation instead of pretending the plan starts now", () => {
    const result = computeTimeline(base, base.departureDateTime);
    expect(result.isLeaveNow).toBe(true);
    expect(result.leaveTime).toEqual(result.stages[0].startTime);
  });
  it("adds time for bags, international travel, families, and extra buffer", () => {
    const normal = computeTimeline(base, now);
    for (const change of [
      { hasCheckedBag: true },
      { tripType: "international" as const },
      { groupType: "family" as const },
      { riskPreference: "early" as const },
    ]) {
      expect(
        computeTimeline({ ...base, ...change }, now).leaveTime.getTime(),
      ).toBeLessThan(normal.leaveTime.getTime());
    }
  });
  it("rejects invalid dates and drive times", () => {
    expect(() =>
      computeTimeline({ ...base, departureDateTime: new Date("invalid") }),
    ).toThrow();
    expect(() => computeTimeline({ ...base, driveTime: NaN })).toThrow();
    expect(validateFlight({ ...base, driveTime: 0 }, now)).toContain(
      "drive time",
    );
    expect(validateFlight(base, base.departureDateTime)).toContain("past");
  });
  it("uses local calendar fields", () => {
    expect(toLocalDate(new Date(2030, 0, 1, 0, 15))).toBe("2030-01-01");
  });
  it("distinguishes Thanksgiving Day from the preceding peak", () => {
    expect(
      analyzeTravelConditions(new Date(2026, 10, 26, 12)).holidayImpact?.name,
    ).toBe("Thanksgiving Day");
  });
});
describe("recent trips", () => {
  it("ignores corrupt storage shapes", () => {
    for (const data of ["null", "{}", '[null, {"airport":"ATL"}]', "broken"]) {
      localStorage.setItem("jetsweep_recent_searches", data);
      expect(getRecentSearches()).toEqual([]);
    }
  });
  it("round-trips the selected options and deduplicates", () => {
    const { departureDateTime, ...inputs } = base;
    const search = {
      airport: "ATL",
      airportName: "Atlanta",
      tripType: base.tripType,
      leaveTime: now.toISOString(),
      flightTime: departureDateTime.toISOString(),
      inputs,
    };
    saveRecentSearch(search);
    saveRecentSearch(search);
    expect(getRecentSearches()).toHaveLength(1);
    expect(getRecentSearches()[0].inputs).toEqual(inputs);
  });
});

describe('traffic at road-departure time', () => {
  it('adds morning traffic for a flight after the rush has ended', () => {
    const result = computeTimeline({ ...base, departureDateTime: new Date(2030, 1, 12, 10, 30) }, now);
    expect(result.travelConditions.trafficMultiplier).toBe(1.35);
    expect(result.stages.find(stage => stage.id === 'drive')?.durationRange.min).toBe(41);
  });
  it('does not add evening rush traffic when the drive occurs earlier', () => {
    const result = computeTimeline({ ...base, departureDateTime: new Date(2030, 1, 12, 16) }, now);
    expect(result.travelConditions.trafficMultiplier).toBe(1);
  });
  it('detects peak traffic crossed between non-peak endpoints', () => {
    const result = analyzeTravelConditions(new Date(2030, 1, 12, 12), {
      start: new Date(2030, 1, 12, 5), end: new Date(2030, 1, 12, 10),
    });
    expect(result.rushHourSeverity).toBe('heavy');
  });
});

it('formats future-trip countdowns in days and clamps overdue values', () => {
  expect(formatCountdown(1500)).toBe('1d 1h');
  expect(formatCountdown(125)).toBe('2h 5m');
  expect(formatCountdown(-10)).toBe('0m');
});
