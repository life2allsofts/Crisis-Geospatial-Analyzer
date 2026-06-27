import { GeospatialStats, RiskAnalysisAiResponse, EscapeRouteProfile } from "../types";

export interface AnalysisApiResponse {
  success: boolean;
  isInGhana: boolean;
  analysis: GeospatialStats;
  ai: RiskAnalysisAiResponse;
  timestamp: string;
}

export async function clearcacheAndFetchApi(
  latitude: number,
  longitude: number,
  bufferRadius: number,
  scenarioId?: string
): Promise<AnalysisApiResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude,
      longitude,
      bufferRadius,
      scenarioId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status} failed`);
  }

  return response.json();
}

export async function fetchHealthStatus(): Promise<{ status: string; geminiKeyDetected: boolean }> {
  const response = await fetch("/api/health");
  if (!response.ok) {
    throw new Error(`Health status check failed`);
  }
  return response.json();
}

export async function fetchEscapeRoute(
  startLat: number,
  startLng: number,
  havenId: string
): Promise<{ success: boolean; routeProfile: EscapeRouteProfile }> {
  const url = `/api/escape-route?startLat=${startLat}&startLng=${startLng}&havenId=${havenId}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch escape route`);
  }
  return response.json();
}
