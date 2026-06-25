import { GHANA_FLOOD_ZONES, FloodZone } from "../data/ghana_flood_zones";
import { CLIMATE_SCENARIOS, ClimateScenario } from "../data/climate_scenarios";

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
    estimatedDisplacedPeople
  };
}
