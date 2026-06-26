import { GHANA_SAFE_HAVENS, SafeHaven } from "../data/safe_havens";

export interface SafeHavenWithDistance extends SafeHaven {
  distanceKm: number;
}

/**
 * Calculates the Haversine distance in kilometers between two lat/lng coordinates.
 */
export function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Finds the nearest safe havens sorted by ascending distance.
 */
export function findNearestSafeHavens(
  lat: number,
  lng: number,
  limit: number = 3
): SafeHavenWithDistance[] {
  const results: SafeHavenWithDistance[] = GHANA_SAFE_HAVENS.map((haven) => {
    const distanceKm = getHaversineDistance(lat, lng, haven.lat, haven.lng);
    return {
      ...haven,
      distanceKm: parseFloat(distanceKm.toFixed(2))
    };
  });

  // Sort by ascending distance (closest first)
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  return results.slice(0, limit);
}
