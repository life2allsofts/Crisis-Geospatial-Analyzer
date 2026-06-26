import { GHANA_FLOOD_ZONES, FloodZone } from "../data/ghana_flood_zones.js";
import { CLIMATE_SCENARIOS, ClimateScenario } from "../data/climate_scenarios.js";
import { ElevationProfile, getElevationProfile } from "../data/elevation.js";
import { findNearestSafeHavens, SafeHavenWithDistance } from "../core/safe_haven.js";

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

// Major cities centers for calculating realistic WorldPop-aligned population density and building exposure
export const GHANA_MAJOR_CITIES = [
  { name: "Accra", lat: 5.5560, lng: -0.1963, baseDensity: 11500, scaleKm: 15 },
  { name: "Kumasi", lat: 6.6900, lng: -1.6163, baseDensity: 8200, scaleKm: 12 },
  { name: "Tamale", lat: 9.4034, lng: -0.8424, baseDensity: 2800, scaleKm: 10 },
  { name: "Sogakope / Mepe", lat: 6.0000, lng: 0.6000, baseDensity: 1100, scaleKm: 8 },
  { name: "Takoradi", lat: 4.8963, lng: -1.7511, baseDensity: 4200, scaleKm: 10 }
];

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
  selectedScenario?: ClimateScenario;
  estimatedDisplacedPeople?: number;
  elevationProfile: ElevationProfile;
  safeHavens?: SafeHavenWithDistance[];
}

export function performGeospatialAnalysis(
  lat: number,
  lng: number,
  bufferRadiusMeters: number,
  scenarioId?: string
): GeospatialAnalysisResult {
  const scenario = CLIMATE_SCENARIOS.find(s => s.id === scenarioId) || CLIMATE_SCENARIOS[0];
  const originalBufferRadiusKm = bufferRadiusMeters / 1000;
  const simulatedBufferRadiusKm = originalBufferRadiusKm * scenario.radiusMultiplier;

  // 0. Compute Digital Elevation Model (DEM) profile
  console.log(`🔍 [geospatial] Executing DEM analysis for target pivot: (${lat}, ${lng}) with buffer ${bufferRadiusMeters}m`);
  const elevationProfile = getElevationProfile(lat, lng, bufferRadiusMeters);
  console.log(`📊 [geospatial] Target center elevation is ${elevationProfile.pointElevation}m ASL, slope is ${elevationProfile.slopePercent}% (${elevationProfile.aspectDirection} slope aspect)`);

  // 0b. Find nearest safe havens
  const safeHavens = findNearestSafeHavens(lat, lng, 3);
  console.log(`🏥 [geospatial] Found ${safeHavens.length} safe havens within proximity`);

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
  let populationDensity = 85; // Rural baseline baseline for Ghana (people per sq km)
  let nearestCityName = "Rural Area";

  for (const city of GHANA_MAJOR_CITIES) {
    const distance = calculateHaversineDistance(lat, lng, city.lat, city.lng);
    // Gaussian decay for city-to-suburb density transition
    const calculatedDensity = city.baseDensity * Math.exp(-Math.pow(distance / city.scaleKm, 2));
    if (calculatedDensity > populationDensity) {
      populationDensity = Math.round(calculatedDensity);
      nearestCityName = city.name;
    }
  }

  // Scale the population density slightly if heavy rainfall increases localized congestion or crowding factors
  const simulatedDensity = Math.round(populationDensity * (1 + (scenario.rainfallFactor - 1) * 0.1));

  // Exposed population = Simulated Density * Simulated Area (pi * R_simulated_km^2)
  const simulatedAreaSqKm = Math.PI * Math.pow(simulatedBufferRadiusKm, 2);
  const estimatedPeopleExposed = Math.round(simulatedDensity * simulatedAreaSqKm);

  // 3. Compute OpenStreetMap aligned infrastructure exposure
  // Buildings are correlated with population density (approx 1 building per 12 people in Ghana)
  const estimatedBuildingsExposed = Math.round(estimatedPeopleExposed / 11);
  // Roads are proportional to population density and buffer size
  const estimatedRoadsExposedKm = parseFloat(
    (simulatedBufferRadiusKm * 2.8 * (1 + Math.log10(simulatedDensity / 10 + 1))).toFixed(2)
  );

  // Calculate estimated displaced people based on displacement coefficient
  // standard displace rate is 15% of exposed population in baseline
  const estimatedDisplacedPeople = Math.round(estimatedPeopleExposed * 0.15 * scenario.displacementCoef);

  // 4. Evaluate Overall Severity Category
  let evaluatedSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  const riskFactors: string[] = [];

  // Track if we had a zone intersection
  if (nearestZone) {
    if (isInsideZone) {
      evaluatedSeverity = nearestZone.severity;
      riskFactors.push(`Direct intersection with ${nearestZone.name} warning boundary`);
    } else if (minDistanceKm <= nearestZone.radiusKm + simulatedBufferRadiusKm + 1.0) {
      // Near buffer zone intersection
      evaluatedSeverity = nearestZone.severity === "CRITICAL" ? "HIGH" : "MEDIUM";
      riskFactors.push(`Close proximity (${minDistanceKm.toFixed(1)} km) to high-hazard ${nearestZone.name}`);
    }
  }

  // Escalate severity based on rainfall intensity of the climate scenario
  if (scenario.rainfallFactor >= 2.0) {
    riskFactors.push(`Extreme rainfall factor (${scenario.rainfallFactor}x) is active under simulated scenario`);
    if (evaluatedSeverity === "LOW") evaluatedSeverity = "HIGH";
    else if (evaluatedSeverity === "MEDIUM" || evaluatedSeverity === "HIGH") evaluatedSeverity = "CRITICAL";
  } else if (scenario.rainfallFactor > 1.0) {
    riskFactors.push(`Elevated rainfall factor (${scenario.rainfallFactor}x) is active under simulated scenario`);
    if (evaluatedSeverity === "LOW") evaluatedSeverity = "MEDIUM";
    else if (evaluatedSeverity === "MEDIUM") evaluatedSeverity = "HIGH";
    else if (evaluatedSeverity === "HIGH") evaluatedSeverity = "CRITICAL";
  }

  // Upgrade severity based on population density and high exposure metrics
  if (estimatedPeopleExposed > 15000) {
    riskFactors.push(`High Population Density in simulated impact area (${simulatedDensity} people/km²)`);
    if (evaluatedSeverity === "LOW") evaluatedSeverity = "MEDIUM";
    else if (evaluatedSeverity === "MEDIUM") evaluatedSeverity = "HIGH";
    else if (evaluatedSeverity === "HIGH") evaluatedSeverity = "CRITICAL";
  } else if (estimatedPeopleExposed > 4000) {
    riskFactors.push(`Urban expansion corridor exposure in ${nearestCityName}`);
  }

  if (estimatedBuildingsExposed > 800) {
    riskFactors.push("High density of residential / commercial structures inside simulated impact buffer");
    if (evaluatedSeverity === "MEDIUM") evaluatedSeverity = "HIGH";
    else if (evaluatedSeverity === "HIGH") evaluatedSeverity = "CRITICAL";
  }

  if (estimatedDisplacedPeople > 100) {
    riskFactors.push(`Significant population displacement risk projected: ${estimatedDisplacedPeople.toLocaleString()} residents`);
  }

  // 5. Evaluate Elevation and Slope Topography factors
  if (elevationProfile.slopePercent > 8) {
    riskFactors.push(`Steep topography with high slope gradient (${elevationProfile.slopePercent}%) accelerates surface runoff toward drainage lines`);
    if (evaluatedSeverity === "LOW") {
      evaluatedSeverity = "MEDIUM";
    } else if (evaluatedSeverity === "MEDIUM") {
      evaluatedSeverity = "HIGH";
    }
  } else if (elevationProfile.slopePercent < 1.5 && elevationProfile.pointElevation < 25) {
    riskFactors.push(`Extremely flat terrain (${elevationProfile.slopePercent}%) and low altitude (${elevationProfile.pointElevation}m ASL) creates a severe risk of prolonged water logging`);
    if (evaluatedSeverity === "LOW") {
      evaluatedSeverity = "MEDIUM";
    } else if (evaluatedSeverity === "MEDIUM") {
      evaluatedSeverity = "HIGH";
    } else if (evaluatedSeverity === "HIGH") {
      evaluatedSeverity = "CRITICAL";
    }
  } else if (elevationProfile.pointElevation < 10) {
    riskFactors.push(`Ultra-low-lying elevation (${elevationProfile.pointElevation}m ASL) increases vulnerability to storm surges, lagoons backup, and poor drainage`);
    if (evaluatedSeverity === "LOW") {
      evaluatedSeverity = "MEDIUM";
    } else if (evaluatedSeverity === "MEDIUM") {
      evaluatedSeverity = "HIGH";
    }
  }

  // If outside all hazard zones and population is low:
  if (riskFactors.length === 0) {
    riskFactors.push("Stable inland topography with low simulated exposure");
  }

  return {
    latitude: lat,
    longitude: lng,
    bufferRadiusKm: originalBufferRadiusKm, // Return original for display consistency
    nearestFloodZone: nearestZone,
    distanceToNearestZoneKm: minDistanceKm,
    isInsideZone,
    estimatedPopulationDensity: simulatedDensity,
    estimatedPeopleExposed,
    estimatedBuildingsExposed,
    estimatedRoadsExposedKm,
    evaluatedSeverity,
    riskFactors,
    selectedScenario: scenario,
    estimatedDisplacedPeople,
    elevationProfile,
    safeHavens
  };
}

// ============================================
// WRAPPER FUNCTION FOR TESTS AND API ROUTES
// ============================================

/**
 * Wrapper function that matches the expected API for tests and routes
 * Converts the detailed analysis to a simplified result format
 */
export async function analyzeLocation(
  lat: number,
  lon: number,
  bufferRadiusMeters: number = 2000,
  scenarioId?: string
): Promise<{
  latitude: number;
  longitude: number;
  floodRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  floodZone: string | null;
  floodZoneId: string | null;
  populationExposed: number;
  buildingsAffected: number;
  distanceToRisk: number;
  riskFactors: string[];
  historicalContext: string[];
  severity: string;
  region: string | null;
  selectedScenario?: ClimateScenario;
  estimatedDisplacedPeople?: number;
  elevationProfile: ElevationProfile;
  safeHavens?: SafeHavenWithDistance[];
}> {
  // Perform the detailed geospatial analysis
  const result = performGeospatialAnalysis(lat, lon, bufferRadiusMeters, scenarioId);

  // Convert to the simplified format expected by tests and routes
  return {
    latitude: lat,
    longitude: lon,
    floodRisk: result.evaluatedSeverity,
    floodZone: result.nearestFloodZone?.name || null,
    floodZoneId: result.nearestFloodZone?.id || null,
    populationExposed: result.estimatedPeopleExposed,
    buildingsAffected: result.estimatedBuildingsExposed,
    distanceToRisk: result.distanceToNearestZoneKm,
    riskFactors: result.riskFactors,
    historicalContext: result.nearestFloodZone?.historicalContext 
      ? [result.nearestFloodZone.historicalContext] 
      : ['No historical context available'],
    severity: result.evaluatedSeverity,
    region: result.nearestFloodZone?.region || null,
    selectedScenario: result.selectedScenario,
    estimatedDisplacedPeople: result.estimatedDisplacedPeople,
    elevationProfile: result.elevationProfile,
    safeHavens: result.safeHavens
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
  // Simplified conversion - in production use proper UTM library
  // Ghana uses UTM Zone 30N (EPSG:32630)
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

/**
 * Get all flood zones
 */
export function getAllFloodZones(): FloodZone[] {
  return GHANA_FLOOD_ZONES;
}

/**
 * Get flood zone by ID
 */
export function getFloodZoneById(id: string): FloodZone | undefined {
  return GHANA_FLOOD_ZONES.find(zone => zone.id === id);
}

/**
 * Get flood zones by region
 */
export function getFloodZonesByRegion(region: string): FloodZone[] {
  return GHANA_FLOOD_ZONES.filter(zone => zone.region.includes(region));
}

// ============================================
// RE-EXPORT FOR CONVENIENCE
// ============================================
export { GHANA_FLOOD_ZONES } from '../data/ghana_flood_zones.js';
export type { FloodZone } from '../data/ghana_flood_zones.js';
export { CLIMATE_SCENARIOS } from '../data/climate_scenarios.js';
export type { ClimateScenario } from '../data/climate_scenarios.js';
export { getElevationProfile } from '../data/elevation.js';
export type { ElevationProfile } from '../data/elevation.js';
export { findNearestSafeHavens } from '../core/safe_haven.js';
export type { SafeHavenWithDistance } from '../core/safe_haven.js';
