import { GHANA_FLOOD_ZONES, FloodZone } from "../data/ghana_flood_zones";
import { calculateHaversineDistance } from "./geospatial";

export interface RetrievedContext {
  nearestZone: FloodZone | null;
  distanceKm: number;
  isInside: boolean;
  contextMessage: string;
}

export function retrieveRagContext(lat: number, lng: number): RetrievedContext {
  let nearestZone: FloodZone | null = null;
  let minDistanceKm = Infinity;

  for (const zone of GHANA_FLOOD_ZONES) {
    const distance = calculateHaversineDistance(
      lat,
      lng,
      zone.coordinates.lat,
      zone.coordinates.lng
    );
    if (distance < minDistanceKm) {
      minDistanceKm = distance;
      nearestZone = zone;
    }
  }

  const isInside = nearestZone ? minDistanceKm <= nearestZone.radiusKm : false;

  const contextMessage = nearestZone
    ? `Nearest Flood Zone: "${nearestZone.name}" in the ${nearestZone.region} region. Distance to nearest point: ${minDistanceKm.toFixed(2)} km. Historical flood impact: ${nearestZone.historicalContext}. Vulnerability factors: ${nearestZone.description}`
    : "This location is positioned outside any major pre-configured high-hazard hydrological plane, with standard rural/suburban drainage behaviors.";

  return {
    nearestZone,
    distanceKm: minDistanceKm,
    isInside,
    contextMessage,
  };
}
