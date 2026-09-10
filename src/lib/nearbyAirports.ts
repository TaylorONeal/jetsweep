import coordinates from './airportCoordinates.json';
import { getAllAirports } from './airports';

export interface NearbyAirport { code: string; name: string; distanceKm: number }
const airports = getAllAirports();
/** Great-circle distance, not road distance or driving time. Named latitude/longitude avoid order ambiguity. */
export function findNearbyAirports(latitude: number, longitude: number): NearbyAirport[] {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
  const radians = (degrees: number) => degrees * Math.PI / 180;
  return coordinates.map(point => {
    const a = Math.sin(radians(point.latitude - latitude) / 2) ** 2 +
      Math.cos(radians(latitude)) * Math.cos(radians(point.latitude)) * Math.sin(radians(point.longitude - longitude) / 2) ** 2;
    const distanceKm = 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
    return { code: point.code, name: airports.find(airport => airport.code === point.code)!.name, distanceKm };
  }).filter(airport => airport.distanceKm <= 200).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
}
