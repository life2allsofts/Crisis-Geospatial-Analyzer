// backend/core/geospatial.ts
import { GHANA_FLOOD_ZONES, FloodZone } from "../data/ghana_flood_zones.js";

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Haversine formula to compute geodesic distance between two points in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ============================================
// GHANA MAJOR CITIES (for population modeling)
// ============================================

export const GHANA_MAJOR_CITIES = [
  { name: "Accra", lat: 5.5560, lng: -0.1963, baseDensity: 11500, scaleKm: 15 },
  { name: "Kumasi", lat: 6.6900, lng: -1.6163, baseDensity: 8200, scaleKm: 12 },
  { name: "Tamale", lat: 9.4034, lng: -0.8424, baseDensity: 2800, scaleKm: 10 },
  { name: "Sogakope / Mepe", lat: 6.0000, lng: 0.6000, baseDensity: 1100, scaleKm: 8 },
  { name: "Takoradi", lat: 4.8963, lng: -1.7511, baseDensity: 4200, scaleKm: 10 }
];

// ============================================
// GEOSPATIAL ANALYSIS RESULT INTERFACE
// ============================================

export interface GeospatialAnalysisResult {
  latitude: number;
  longitude: number;
  bufferRadiusKm: number;
  nearestFloodZone: FloodZone | null;
  distanceToNearestZoneKm: number;
  isInsideZone: boolean;
  estimatedPopulationDensity: number; // people per sq km
  estimatedPeopleExposed: number; // in Buffer
  estimatedBuildingsExposed: number; // in Buffer
  estimatedRoadsExposedKm: number; // in Buffer
  evaluatedSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskFactors: string[];
}

// ============================================
// CORE GEOSPATIAL ANALYSIS FUNCTION
// ============================================

export function performGeospatialAnalysis(
  lat: number,
  lng: number,
  bufferRadiusMeters: number
): GeospatialAnalysisResult {
  const bufferRadiusKm = bufferRadiusMeters / 1000;

  // 1. Find nearest flood risk zone
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

  const isInsideZone = nearestZone ? minDistanceKm <= nearestZone.radiusKm : false;

  // 2. Compute WorldPop-aligned population exposure.
  // Distance-decay model from major city centers to represent realistic spatial statistics!
  let populationDensity = 85; // Rural baseline for Ghana (people per sq km)

  for (const city of GHANA_MAJOR_CITIES) {
    const distance = calculateHaversineDistance(lat, lng, city.lat, city.lng);
    // Gaussian decay for city-to-suburb density transition
    const calculatedDensity = city.baseDensity * Math.exp(-Math.pow(distance / city.scaleKm, 2));
    if (calculatedDensity > populationDensity) {
      populationDensity = Math.round(calculatedDensity);
    }
  }

  // Exposed population = Density * Area (pi * R_km^2)
  const bufferAreaSqKm = Math.PI * Math.pow(bufferRadiusKm, 2);
  const estimatedPeopleExposed = Math.round(populationDensity * bufferAreaSqKm);

  // 3. Compute OpenStreetMap aligned infrastructure exposure
  // Buildings are correlated with population density (approx 1 building per 11 people in Ghana)
  const estimatedBuildingsExposed = Math.round(estimatedPeopleExposed / 11);
  // Roads are proportional to population density and buffer size
  const estimatedRoadsExposedKm = parseFloat(
    (bufferRadiusKm * 2.8 * (1 + Math.log10(populationDensity / 10 + 1))).toFixed(2)
  );

  // 4. Evaluate Overall Severity Category
  let evaluatedSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  const riskFactors: string[] = [];

  if (nearestZone) {
    if (isInsideZone) {
      evaluatedSeverity = nearestZone.severity;
      riskFactors.push(`Direct intersection with ${nearestZone.name} warning boundary`);
    } else if (minDistanceKm <= nearestZone.radiusKm + bufferRadiusKm + 1.0) {
      // Near buffer zone intersection
      evaluatedSeverity = nearestZone.severity === "CRITICAL" ? "HIGH" : "MEDIUM";
      riskFactors.push(`Close proximity (${minDistanceKm.toFixed(1)} km) to high-hazard ${nearestZone.name}`);
    }
  }

  // Upgrade severity based on population density and high exposure metrics
  if (estimatedPeopleExposed > 15000) {
    riskFactors.push(`High Population Density in local watershed area (${populationDensity} people/km²)`);
    if (evaluatedSeverity === "LOW") evaluatedSeverity = "MEDIUM";
    else if (evaluatedSeverity === "MEDIUM") evaluatedSeverity = "HIGH";
  } else if (estimatedPeopleExposed > 4000) {
    riskFactors.push(`Urban expansion corridor exposure`);
  }

  if (estimatedBuildingsExposed > 800) {
    riskFactors.push("High density of residential / commercial structures inside hazard buffer");
    if (evaluatedSeverity === "MEDIUM") evaluatedSeverity = "HIGH";
  }

  // If outside all hazard zones and population is low:
  if (riskFactors.length === 0) {
    riskFactors.push("Stable inland topography with low building exposure");
  }

  return {
    latitude: lat,
    longitude: lng,
    bufferRadiusKm,
    nearestFloodZone: nearestZone,
    distanceToNearestZoneKm: minDistanceKm,
    isInsideZone,
    estimatedPopulationDensity: populationDensity,
    estimatedPeopleExposed,
    estimatedBuildingsExposed,
    estimatedRoadsExposedKm,
    evaluatedSeverity,
    riskFactors
  };
}

// ============================================
// WRAPPER FUNCTION FOR API AND TESTS
// ============================================

/**
 * Wrapper function that matches the expected API for tests and routes
 * Converts the detailed analysis to a simplified result format
 */
export async function analyzeLocation(
  lat: number, 
  lon: number,
  bufferRadiusMeters: number = 2000
): Promise<{
  latitude: number;
  longitude: number;
  floodRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  floodZone: string | null;
  populationExposed: number;
  buildingsAffected: number;
  distanceToRisk: number;
  riskFactors: string[];
  easting?: number;
  northing?: number;
}> {
  // Perform the detailed geospatial analysis
  const result = performGeospatialAnalysis(lat, lon, bufferRadiusMeters);
  
  // Convert to the simplified format expected by tests and routes
  return {
    latitude: lat,
    longitude: lon,
    floodRisk: result.evaluatedSeverity,
    floodZone: result.nearestFloodZone?.name || null,
    populationExposed: result.estimatedPeopleExposed,
    buildingsAffected: result.estimatedBuildingsExposed,
    distanceToRisk: result.distanceToNearestZoneKm,
    riskFactors: result.riskFactors
  };
}

// ============================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================

/**
 * Convert Ghana Grid coordinates (Easting, Northing) to Geographic (Lat, Lon)
 * UTM Zone 30N projection for Ghana
 */
export function convertGridToGeo(easting: number, northing: number): { lat: number; lon: number } {
  // Simple approximation for Ghana Grid (UTM Zone 30N)
  // For production, use a proper library like 'geodesy'
  // This is a simplified version for demonstration
  const zone = 30;
  const hemisphere = 'N';
  
  // Simplified conversion - in production use proper UTM library
  // This is a placeholder - actual conversion requires proper UTM math
  const lon = (easting - 500000) / 111320; // Rough approximation
  const lat = northing / 111320;
  
  return {
    lat: lat,
    lon: lon
  };
}

/**
 * Convert Geographic coordinates to Ghana Grid
 */
export function convertGeoToGrid(lat: number, lon: number): { easting: number; northing: number } {
  // Simplified conversion - in production use proper UTM library
  const easting = lon * 111320 + 500000;
  const northing = lat * 111320;
  
  return {
    easting: easting,
    northing: northing
  };
}

/**
 * Create a buffer zone around a point
 */
export function createBuffer(lat: number, lon: number, radiusKm: number): {
  center: { lat: number; lon: number };
  radius: number;
} {
  return {
    center: { lat, lon },
    radius: radiusKm
  };
}

/**
 * Check if a point is within any flood zone
 * Returns the flood zone if found, null otherwise
 */
export function pointInPolygon(lat: number, lon: number): { inZone: boolean; zoneName: string | null } {
  for (const zone of GHANA_FLOOD_ZONES) {
    const distance = calculateHaversineDistance(lat, lon, zone.coordinates.lat, zone.coordinates.lng);
    if (distance <= zone.radiusKm) {
      return { inZone: true, zoneName: zone.name };
    }
  }
  return { inZone: false, zoneName: null };
}

// ============================================
// RE-EXPORT FLOOD ZONES FOR CONVENIENCE
// ============================================

export { GHANA_FLOOD_ZONES } from '../data/ghana_flood_zones.js';
export type { FloodZone } from '../data/ghana_flood_zones.js';