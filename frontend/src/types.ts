export interface FloodZoneInfo {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
  radiusKm: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  source: string;
}

export interface ClimateScenarioInfo {
  id: string;
  name: string;
  description: string;
  rainfallFactor: number;
  radiusMultiplier: number;
  displacementCoef: number;
}

export interface ElevationProfileInfo {
  pointElevation: number;
  slope: number;
  slopePercent: number;
  aspect: number;
  aspectDirection: string;
  minElevation: number;
  maxElevation: number;
  meanElevation: number;
  profilePoints: Array<{
    distanceKm: number;
    elevation: number;
    lat: number;
    lng: number;
  }>;
}

export interface GeospatialStats {
  latitude: number;
  longitude: number;
  bufferRadiusKm: number;
  nearestFloodZone: FloodZoneInfo | null;
  distanceToNearestZoneKm: number;
  isInsideZone: boolean;
  estimatedPopulationDensity: number;
  estimatedPeopleExposed: number;
  estimatedBuildingsExposed: number;
  estimatedRoadsExposedKm: number;
  evaluatedSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskFactors: string[];
  selectedScenario?: ClimateScenarioInfo;
  estimatedDisplacedPeople?: number;
  elevationProfile: ElevationProfileInfo;
  safeHavens?: SafeHavenWithDistance[];
}

export interface SafeHaven {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  capacity: number;
  region: string;
  contact: string;
  evacuationRoutes: string[];
}

export interface SafeHavenWithDistance extends SafeHaven {
  distanceKm: number;
}

export interface CitationInfo {
  name: string;
  dataset: string;
  attribution: string;
  link?: string;
}

export interface AiRiskResponse {
  summary: string;
  reasoning: string;
  recommendations: string[];
  citations: CitationInfo[];
}

export type RiskAnalysisAiResponse = AiRiskResponse;

export interface AnalyzeApiResponse {
  success: boolean;
  isInGhana: boolean;
  analysis: GeospatialStats;
  ai: AiRiskResponse;
  timestamp: string;
}

export interface LocationPreset {
  name: string;
  region: string;
  lat: number;
  lng: number;
  bufferRadius: number;
  dangerLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export const GHANA_PRESETS: LocationPreset[] = [
  {
    name: "Alajo & Circle Confluence",
    region: "Greater Accra",
    lat: 5.5891,
    lng: -0.2145,
    bufferRadius: 1800,
    dangerLevel: "CRITICAL"
  },
  {
    name: "Mepe Lower Volta Basin",
    region: "Volta Region",
    lat: 5.9875,
    lng: 0.6120,
    bufferRadius: 4500,
    dangerLevel: "CRITICAL"
  },
  {
    name: "Subin River Market Area",
    region: "Kumasi, Ashanti",
    lat: 6.6948,
    lng: -1.6144,
    bufferRadius: 1500,
    dangerLevel: "HIGH"
  },
  {
    name: "Weija Dam Downstream",
    region: "Greater Accra",
    lat: 5.5682,
    lng: -0.2854,
    bufferRadius: 2500,
    dangerLevel: "HIGH"
  },
  {
    name: "Tamale South Lowlands",
    region: "Northern Region",
    lat: 9.3824,
    lng: -0.8354,
    bufferRadius: 3000,
    dangerLevel: "MEDIUM"
  },
  {
    name: "Sunyani Highland Center",
    region: "Bono Region (Safe)",
    lat: 7.3349,
    lng: -2.3124,
    bufferRadius: 2000,
    dangerLevel: "LOW"
  },
  {
    name: "Tarkwa Gold Mining Valley",
    region: "Western Region",
    lat: 5.3014,
    lng: -2.0024,
    bufferRadius: 2500,
    dangerLevel: "HIGH"
  },
  {
    name: "Sekondi-Takoradi Coast",
    region: "Western Region",
    lat: 4.8871,
    lng: -1.7485,
    bufferRadius: 2000,
    dangerLevel: "HIGH"
  },
  {
    name: "Bolgatanga White Volta Plain",
    region: "Upper East Region",
    lat: 10.7856,
    lng: -0.8514,
    bufferRadius: 3500,
    dangerLevel: "CRITICAL"
  },
  {
    name: "Wa South Lowland Basin",
    region: "Upper West Region",
    lat: 9.8974,
    lng: -2.5085,
    bufferRadius: 2200,
    dangerLevel: "MEDIUM"
  },
  {
    name: "Cape Coast Erosion Belt",
    region: "Central Region",
    lat: 5.1053,
    lng: -1.2464,
    bufferRadius: 1800,
    dangerLevel: "HIGH"
  },
  {
    name: "Kasoa Akweley Junction",
    region: "Central Region",
    lat: 5.5424,
    lng: -0.4215,
    bufferRadius: 2000,
    dangerLevel: "HIGH"
  },
  {
    name: "Koforidua Nsukwao Basin",
    region: "Eastern Region",
    lat: 6.0945,
    lng: -0.2591,
    bufferRadius: 1800,
    dangerLevel: "HIGH"
  },
  {
    name: "Buipe Black Volta Crossing",
    region: "Savannah Region",
    lat: 8.7845,
    lng: -1.5423,
    bufferRadius: 3200,
    dangerLevel: "HIGH"
  },
  {
    name: "Nkwanta River Siltation",
    region: "Oti Region",
    lat: 8.2575,
    lng: 0.5214,
    bufferRadius: 2000,
    dangerLevel: "MEDIUM"
  },
  {
    name: "Goaso Tano River Basin",
    region: "Ahafo Region",
    lat: 6.8041,
    lng: -2.5183,
    bufferRadius: 2000,
    dangerLevel: "MEDIUM"
  }
];

export const CLIMATE_SCENARIOS: ClimateScenarioInfo[] = [
  {
    id: "baseline",
    name: "Standard Baseline",
    description: "Historical annual average rainfall and standard drainage runoff parameters.",
    rainfallFactor: 1.0,
    radiusMultiplier: 1.0,
    displacementCoef: 1.0
  },
  {
    id: "heavy_monsoon",
    name: "Heavy Seasonal Monsoon",
    description: "Intense tropical downpour over 72 hours, exceeding localized drainage capacities by 50%.",
    rainfallFactor: 1.5,
    radiusMultiplier: 1.2,
    displacementCoef: 1.4
  },
  {
    id: "dam_spillway",
    name: "Bagre Dam Spillway Release",
    description: "Upstream transboundary dam releases coupled with high peak seasonal water flows.",
    rainfallFactor: 1.8,
    radiusMultiplier: 1.5,
    displacementCoef: 2.2
  },
  {
    id: "super_cell",
    name: "100-Yr Climate Storm Supercell",
    description: "Extreme storm cell causing unprecedented localized flash-flooding and storm surges.",
    rainfallFactor: 2.5,
    radiusMultiplier: 2.0,
    displacementCoef: 3.5
  }
];

export interface HistoricalFloodEvent {
  id: string;
  year: number;
  eventName: string;
  regions: string[];
  peopleDisplaced: number;
  deaths?: number;
  propertyDamage: string;
  trigger: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  source: string;
}


