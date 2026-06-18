import { Router, Request, Response } from "express";
import { performGeospatialAnalysis } from "../core/geospatial";
import { generateAiRiskAssessment } from "../core/llm_service";

export const apiRouter = Router();
export const router = apiRouter;

// Coordinate validation limits for general validity, with specific warnings for Ghana bounds
const GHANA_BOUNDS = {
  minLat: 4.5,
  maxLat: 11.5,
  minLng: -3.5,
  maxLng: 1.5,
};

apiRouter.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, bufferRadius = 2000 } = req.body;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusMeters = parseInt(bufferRadius);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      res.status(400).json({
        success: false,
        error: "Invalid Latitude index. Must be a valid floating number between -90 and 90.",
      });
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      res.status(400).json({
        success: false,
        error: "Invalid Longitude index. Must be a valid floating number between -180 and 180.",
      });
      return;
    }

    if (isNaN(radiusMeters) || radiusMeters < 500 || radiusMeters > 10000) {
      res.status(400).json({
        success: false,
        error: "Invalid Buffer Radius. Must be a whole number between 500m and 10000m (10km).",
      });
      return;
    }

    // Determine geographic boundary boundary warning for Ghana
    const isInsideGhanaBounds =
      lat >= GHANA_BOUNDS.minLat &&
      lat <= GHANA_BOUNDS.maxLat &&
      lng >= GHANA_BOUNDS.minLng &&
      lng <= GHANA_BOUNDS.maxLng;

    // Execute core geospatial analytics
    const geoAnalysis = performGeospatialAnalysis(lat, lng, radiusMeters);

    // Call RAG LLM summary logic (includes fallback in case of missing keys)
    const aiAssessment = await generateAiRiskAssessment(geoAnalysis);

    res.json({
      success: true,
      isInGhana: isInsideGhanaBounds,
      analysis: geoAnalysis,
      ai: aiAssessment,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("API error during route analysis:", error);
    res.status(500).json({
      success: false,
      error: "Surgical analysis failed inside geospatial backend.",
      details: error.message
    });
  }
});

apiRouter.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    geminiKeyDetected: !!process.env.GEMINI_API_KEY,
    appUrl: process.env.APP_URL || "http://localhost:3000",
    service: "Crisis Geospatial Analyzer",
    version: "1.0.0-PROD",
    time: new Date().toISOString()
  });
});
