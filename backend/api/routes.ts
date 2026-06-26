import { Router, Request, Response } from "express";
import { performGeospatialAnalysis } from "../core/geospatial";
import { generateAiRiskAssessment } from "../core/llm_service";
import { findNearestSafeHavens } from "../core/safe_haven";
import { GHANA_HISTORICAL_FLOODS } from "../data/historical_floods";

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
    const { latitude, longitude, bufferRadius = 2000, scenarioId } = req.body;

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

    // Execute core geospatial analytics with the chosen climate scenario
    const geoAnalysis = performGeospatialAnalysis(lat, lng, radiusMeters, scenarioId);

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

apiRouter.get("/safe-havens", (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string || req.query.latitude as string);
    const lng = parseFloat(req.query.lng as string || req.query.longitude as string);
    const limit = parseInt(req.query.limit as string || "3");

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({
        success: false,
        error: "Missing or invalid latitude/longitude parameters.",
      });
      return;
    }

    const havens = findNearestSafeHavens(lat, lng, limit);
    res.json({
      success: true,
      safeHavens: havens,
    });
  } catch (error: any) {
    console.error("Error fetching safe havens:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve nearest safe havens",
      details: error.message
    });
  }
});

apiRouter.get("/historical-events", (req: Request, res: Response) => {
  try {
    const { region, startYear, endYear } = req.query;
    let events = [...GHANA_HISTORICAL_FLOODS];

    if (region && typeof region === "string" && region !== "all" && region.trim() !== "") {
      const lowerRegion = region.toLowerCase().trim();
      events = events.filter(e => e.regions.some(r => r.toLowerCase().includes(lowerRegion)));
    }

    if (startYear) {
      const start = parseInt(startYear as string);
      if (!isNaN(start)) {
        events = events.filter(e => e.year >= start);
      }
    }

    if (endYear) {
      const end = parseInt(endYear as string);
      if (!isNaN(end)) {
        events = events.filter(e => e.year <= end);
      }
    }

    res.json({
      success: true,
      events
    });
  } catch (error: any) {
    console.error("Error fetching historical events:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve historical events",
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
