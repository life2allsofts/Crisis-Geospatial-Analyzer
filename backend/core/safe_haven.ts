import { GHANA_SAFE_HAVENS, SafeHaven } from "../data/safe_havens";
import { getElevationAt } from "../data/elevation";

export interface SafeHavenWithDistance extends SafeHaven {
  distanceKm: number;
  elevation: number;
  distanceScore: number;
  elevationSafetyScore: number;
  smartScore: number;
  isSameDistrict: boolean;
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
 * Finds the nearest safe havens sorted by a combination of proximity and elevation safety,
 * prioritizing same-district shelters.
 */
export function findNearestSafeHavens(
  lat: number,
  lng: number,
  limit: number = 5 // Enhanced to show 5 buttons as requested
): SafeHavenWithDistance[] {
  // 1. Calculate raw distance and identify the closest safe haven to determine the user's district
  let closestRawHaven: SafeHaven | null = null;
  let minRawDistance = Infinity;

  GHANA_SAFE_HAVENS.forEach((haven) => {
    const d = getHaversineDistance(lat, lng, haven.lat, haven.lng);
    if (d < minRawDistance) {
      minRawDistance = d;
      closestRawHaven = haven;
    }
  });

  const userDistrict = closestRawHaven ? (closestRawHaven as SafeHaven).district : "";

  // 2. Map safe havens to calculate distances, elevations, scores, and district matching
  const results: SafeHavenWithDistance[] = GHANA_SAFE_HAVENS.map((haven) => {
    const distanceKm = getHaversineDistance(lat, lng, haven.lat, haven.lng);
    
    // Get the actual physical elevation at the safe haven't location
    const elevation = Math.round(getElevationAt(haven.lat, haven.lng));

    // Distance Score (0 - 100): closer is better
    // Decays to 0 at 45km
    const distanceScore = Math.round(Math.max(0, 100 - (distanceKm * 2.2)));

    // Elevation Safety Score (0 - 100): higher is better
    // 0 points at 5m ASL or below (extreme risk), 100 points at 30m ASL or higher
    const elevationSafetyScore = Math.round(
      Math.min(100, Math.max(0, (elevation - 5) * 4))
    );

    // Smart Score: 60% proximity distance + 40% elevation safety
    let smartScore = Math.round((distanceScore * 0.6) + (elevationSafetyScore * 0.4));

    // District matching priority check
    const isSameDistrict = haven.district === userDistrict;
    
    // Same-district boost: adds an incentive for local administrative shelters
    if (isSameDistrict) {
      smartScore += 15; // Moderated boost
    }

    return {
      ...haven,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      elevation,
      distanceScore,
      elevationSafetyScore,
      smartScore,
      isSameDistrict
    };
  });

  // 3. Sort by descending smartScore (highest rank first). If scores are identical, prefer closer raw distance
  results.sort((a, b) => {
    if (b.smartScore !== a.smartScore) {
      return b.smartScore - a.smartScore;
    }
    return a.distanceKm - b.distanceKm;
  });

  return results.slice(0, limit);
}
