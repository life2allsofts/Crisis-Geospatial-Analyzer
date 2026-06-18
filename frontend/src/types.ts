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
  }
];
