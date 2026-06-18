import { GeospatialStats, RiskAnalysisAiResponse } from "../types";

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
  bufferRadius: number
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
