import type { FlightInputs } from "./timeline";

export function toLocalDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function validateFlight(
  inputs: FlightInputs,
  now = new Date(),
): string | null {
  if (!inputs.airport) return "Choose your departure airport to continue.";
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
