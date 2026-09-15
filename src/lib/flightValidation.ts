import { getAllAirports, OTHER_AIRPORT_OPTIONS } from './airports';
const supportedCodes = new Set([...getAllAirports(), ...OTHER_AIRPORT_OPTIONS].map(a => a.code));
export const isSupportedAirport = (code: string) => supportedCodes.has(code);

import type { FlightInputs } from "./timeline";

export function toLocalDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function validateFlight(
  inputs: FlightInputs,
  now = new Date(),
): string | null {
  if (!inputs.airport || !isSupportedAirport(inputs.airport)) return "Choose your departure airport to continue.";
  if (!Number.isFinite(inputs.departureDateTime.getTime()))
    return "Enter a valid departure date and time.";
  if (inputs.departureDateTime <= now)
    return "Your departure is in the past. Choose an upcoming flight.";
  if (
    inputs.driveTime !== undefined &&
    (!Number.isInteger(inputs.driveTime) ||
      inputs.driveTime < 1 ||
      inputs.driveTime > 360)
  )
    return "Enter a drive time from 1 to 360 minutes.";
  return null;
}

/** Reject calendar rollovers and nonexistent local times (such as a DST spring-forward gap). */
export function parseLocalDeparture(date: string, time: string): Date {
  const invalid = () => new Date(NaN);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return invalid();
  const result = new Date(date + 'T' + time);
  if (!Number.isFinite(result.getTime()) || toLocalDate(result) !== date || result.toTimeString().slice(0, 5) !== time) return invalid();
  return result;
}
