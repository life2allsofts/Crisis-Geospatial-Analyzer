// backend/data/elevation.ts

export interface ElevationProfile {
  pointElevation: number; // meters
  slope: number; // degrees
  slopePercent: number; // percent
  aspect: number; // direction of slope (0-360)
  aspectDirection: string; // compass direction
  minElevation: number; // within buffer
  maxElevation: number;
  meanElevation: number;
  profilePoints: Array<{
    distanceKm: number;
    elevation: number;
    lat: number;
    lng: number;
  }>;
}

/**
 * REAL SURVEY CONTROL POINTS FROM SMD/LANDS COMMISSION
 * These are actual surveyed orthometric heights (meters above sea level)
 * Source: Survey and Mapping Division, Lands Commission, Ghana
 */
export const SURVEY_CONTROL_POINTS = [
  // ============================================
  // BUI BASE - Northern Region
  // ============================================
  { 
    name: "SG GRN 09/NEL1", 
    lat: 8.141253, 
    lng: -2.030440, 
    elevation: 110.876, 
    region: "Bui",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SG GRN 09/NEL2", 
    lat: 8.141754, 
    lng: -2.030479, 
    elevation: 110.726, 
    region: "Bui",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SGN 11/07/1", 
    lat: 8.164329, 
    lng: -2.033069, 
    elevation: 111.660, 
    region: "Bui",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // MIM BASE - Ahafo Region
  // ============================================
  { 
    name: "SG GRN 09/GAS1", 
    lat: 6.808341, 
    lng: -2.515896, 
    elevation: 216.915, 
    region: "Mim",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SG GRN 09/GAS2", 
    lat: 6.807847, 
    lng: -2.515634, 
    elevation: 215.038, 
    region: "Mim",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // SUNYANI BASE - Bono Region
  // ============================================
  { 
    name: "SGB 20/06/GPS 21", 
    lat: 7.338842, 
    lng: -2.335091, 
    elevation: 298.867, 
    region: "Sunyani",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SGB 20/06/GPS 22", 
    lat: 7.340845, 
    lng: -2.337409, 
    elevation: 307.780, 
    region: "Sunyani",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SGBCFP 308A", 
    lat: 7.346997, 
    lng: -2.336373, 
    elevation: 345.661, 
    region: "Sunyani",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SGFBM 23", 
    lat: 7.349400, 
    lng: -2.343474, 
    elevation: 311.770, 
    region: "Sunyani",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // PRAMPRAM BASE - Greater Accra
  // ============================================
  { 
    name: "ACCRA", 
    lat: 5.590777, 
    lng: -0.182435, 
    elevation: 61.342, 
    region: "Accra",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SGGA SS 66", 
    lat: 5.590159, 
    lng: -0.182329, 
    elevation: 51.452, 
    region: "Accra",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // ENCHI BASE - Western North Region
  // ============================================
  { 
    name: "SG GPS2 08/29B", 
    lat: 5.814250, 
    lng: -2.824350, 
    elevation: 88.737, 
    region: "Enchi",
    source: "SMD/Lands Commission"
  },
  { 
    name: "GCS 291", 
    lat: 5.798709, 
    lng: -2.858507, 
    elevation: 345.412, 
    region: "Enchi",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SG GPS2 08/29C", 
    lat: 5.813428, 
    lng: -2.824358, 
    elevation: 90.956, 
    region: "Enchi",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // ASANKRAGWA BASE - Western Region
  // ============================================
  { 
    name: "SG GPS2 08/23B", 
    lat: 5.807538, 
    lng: -2.425501, 
    elevation: 113.312, 
    region: "Asankragwa",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SG GPS2/08 23A", 
    lat: 5.807558, 
    lng: -2.426495, 
    elevation: 112.316, 
    region: "Asankragwa",
    source: "SMD/Lands Commission"
  },
  { 
    name: "GCG WP 24/31/4", 
    lat: 5.806902, 
    lng: -2.436628, 
    elevation: 101.358, 
    region: "Asankragwa",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // WIASO BASE - Western Region
  // ============================================
  { 
    name: "SG GPS2/08/30A", 
    lat: 6.213789, 
    lng: -2.485187, 
    elevation: 194.945, 
    region: "Wiaso",
    source: "SMD/Lands Commission"
  },
  { 
    name: "SG GPS2/08/30B", 
    lat: 6.214200, 
    lng: -2.484820, 
    elevation: 195.245, 
    region: "Wiaso",
    source: "SMD/Lands Commission"
  },
  { 
    name: "GCG WP 3/34/28", 
    lat: 6.208502, 
    lng: -2.487179, 
    elevation: 250.441, 
    region: "Wiaso",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // BIBIANI BASE - Western Region
  // ============================================
  { 
    name: "SG GPS2/08/32A", 
    lat: 6.456292, 
    lng: -2.314009, 
    elevation: 212.906, 
    region: "Bibiani",
    source: "SMD/Lands Commission"
  },
  
  // ============================================
  // ABURI-DODOWA-MAMPONG-AKROPONG BASE
  // ============================================
  { 
    name: "ACRA", 
    lat: 5.590777, 
    lng: -0.182435, 
    elevation: 61.634, 
    region: "Aburi",
    source: "SMD/Lands Commission"
  },
  { 
    name: "CFP 155", 
    lat: 5.939036, 
    lng: -0.121995, 
    elevation: 499.384, 
    region: "Aburi",
    source: "SMD/Lands Commission"
  }
];

/**
 * Regional reference points for areas without survey coverage
 * These help provide context in un-surveyed areas
 */
const REGIONAL_REFERENCE_POINTS = [
  { lat: 5.5414, lng: -0.2198, elevation: 8, region: "Coastal Accra", weight: 0.5 },
  { lat: 5.9200, lng: -0.1200, elevation: 320, region: "Akwapim Ridge", weight: 0.5 },
  { lat: 6.6000, lng: -0.7000, elevation: 490, region: "Kwahu Plateau", weight: 0.5 },
  { lat: 7.0000, lng: -0.1000, elevation: 85, region: "Lake Volta Basin", weight: 0.5 },
  { lat: 9.3824, lng: -0.8354, elevation: 165, region: "Tamale Savannah", weight: 0.5 },
  { lat: 11.1000, lng: -0.5000, elevation: 210, region: "Northern Border", weight: 0.5 }
];

/**
 * Get elevation at a specific coordinate using Inverse Distance Weighting (IDW)
 * from real survey control points, blended with regional context
 */
export function getElevationAt(lat: number, lng: number): number {
  // 1. Inverse Distance Weighting from REAL survey points
  let totalWeight = 0;
  let weightedElevationSum = 0;
  const power = 2.0;

  // Check if we're exactly at a survey point
  for (const p of SURVEY_CONTROL_POINTS) {
    const dLat = lat - p.lat;
    const dLng = lng - p.lng;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng);
    
    // If within 10 meters of a survey point, use it directly
    if (distance < 0.0001) {
      return p.elevation;
    }
    
    const w = 1 / Math.pow(distance, power);
    weightedElevationSum += p.elevation * w;
    totalWeight += w;
  }

  let baseElevation = weightedElevationSum / totalWeight;

  // 2. Blend with regional reference for areas far from survey points
  let regionalWeight = 0;
  let regionalSum = 0;
  
  for (const p of REGIONAL_REFERENCE_POINTS) {
    const dLat = lat - p.lat;
    const dLng = lng - p.lng;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng) || 0.001;
    const w = p.weight / Math.pow(distance, 1.5);
    regionalSum += p.elevation * w;
    regionalWeight += w;
  }

  // Blend: 70% survey IDW, 30% regional context
  if (regionalWeight > 0) {
    const regionalElevation = regionalSum / regionalWeight;
    baseElevation = baseElevation * 0.7 + regionalElevation * 0.3;
  }

  // 3. Multi-frequency fractal topography waves for local variation
  // This simulates realistic micro-topography not captured by survey points
  
  // Detect if in a flat region (plains/delta)
  const distToMepe = Math.sqrt(Math.pow(lat - 5.9875, 2) + Math.pow(lng - 0.6120, 2));
  const distToCoast = Math.abs(lat - 5.48);
  const isPlainRegion = distToMepe < 0.4 || (lat < 5.6 && distToCoast < 0.15);
  
  // Detect if in Akwapim Ridge (rugged terrain)
  const isAkwapimRidge = lat > 5.75 && lat < 6.1 && lng > -0.2 && lng < 0.0;
  
  // Detect if in Kumasi area
  const isKumasi = Math.abs(lat - 6.6948) < 0.3 && Math.abs(lng - (-1.6144)) < 0.3;

  let hillAmplitude1 = 25;   // Mid-range hills (wavelength ~ 8km)
  let hillAmplitude2 = 8;    // Local ridges (wavelength ~ 1.5km)
  let bumpAmplitude = 2.5;   // Micro bumps (wavelength ~ 250m)

  if (isPlainRegion) {
    // Dampen amplitude in plains/estuaries
    hillAmplitude1 = 4;
    hillAmplitude2 = 1.0;
    bumpAmplitude = 0.3;
  } else if (isAkwapimRidge) {
    // Escalate ruggedness in Akwapim Ridge
    hillAmplitude1 = 60;
    hillAmplitude2 = 18;
    bumpAmplitude = 4.0;
  } else if (isKumasi) {
    // Kumasi rolling hills
    hillAmplitude1 = 30;
    hillAmplitude2 = 12;
    bumpAmplitude = 3.0;
  }

  // Deterministic 2D wave functions
  const term1 = Math.sin(lat * 100) * Math.cos(lng * 100);
  const term2 = Math.cos(lat * 480 + 0.5) * Math.sin(lng * 420 - 0.2);
  const term3 = Math.sin(lat * 2800) * Math.sin(lng * 3000);

  const localTopography = 
    term1 * hillAmplitude1 + 
    term2 * hillAmplitude2 + 
    term3 * bumpAmplitude;

  let finalElevation = baseElevation + localTopography;

  // 4. Enforce realistic bounds
  if (finalElevation < 0.5) {
    finalElevation = 0.5 + Math.abs(Math.sin(lat * 10000) * 1.5);
  }

  // Cap at realistic maximum (Mount Afadjato is ~880m, so cap at 900m)
  if (finalElevation > 900) {
    finalElevation = 900 - Math.abs(Math.cos(lng * 500) * 10);
  }

  return parseFloat(finalElevation.toFixed(2));
}

/**
 * Converts compass angle (0-360) to human readable direction
 */
export function getCompassDirection(degrees: number): string {
  const directions = [
    "North ⬆️", "North-East ↗️", "East ➡️", "South-East ↘️",
    "South ⬇️", "South-West ↙️", "West ⬅️", "North-West ↖️"
  ];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}

/**
 * Calculates slope, aspect, min, max, and generates an elevation cross-section profile
 */
export function getElevationProfile(
  lat: number,
  lng: number,
  bufferRadiusMeters: number
): ElevationProfile {
  const centerElev = getElevationAt(lat, lng);

  // 1. Analytical Slope & Aspect calculation using 4 cardinal samples at 30m distance
  const deltaDegrees = 0.00027;
  const deltaMeters = 30;

  const z_n = getElevationAt(lat + deltaDegrees, lng);
  const z_s = getElevationAt(lat - deltaDegrees, lng);
  const z_e = getElevationAt(lat, lng + deltaDegrees);
  const z_w = getElevationAt(lat, lng - deltaDegrees);

  // Partial derivatives in meters
  const dz_dx = (z_e - z_w) / (2 * deltaMeters);
  const dz_dy = (z_n - z_s) / (2 * deltaMeters);

  const slopeGrad = Math.sqrt(dz_dx * dz_dx + dz_dy * dz_dy);
  const slopePercent = parseFloat((slopeGrad * 100).toFixed(2));
  const slopeDegrees = parseFloat((Math.atan(slopeGrad) * (180 / Math.PI)).toFixed(2));

  // Aspect (0 to 360 degrees)
  let aspectDeg = 0;
  if (dz_dx !== 0 || dz_dy !== 0) {
    const angleRad = Math.atan2(dz_dx, dz_dy);
    aspectDeg = (angleRad * (180 / Math.PI) + 360) % 360;
  }
  aspectDeg = parseFloat(aspectDeg.toFixed(1));
  const aspectDir = getCompassDirection(aspectDeg);

  // 2. Elevation profile sampling along a Southwest-to-Northeast diagonal
  const radiusKm = bufferRadiusMeters / 1000;
  const sampleCount = 9;
  const profilePoints: ElevationProfile["profilePoints"] = [];
  
  let minElev = centerElev;
  let maxElev = centerElev;
  let sumElev = 0;

  // Degrees per km
  const latPerKm = 0.009;
  const lngPerKm = 0.009;

  for (let i = 0; i < sampleCount; i++) {
    const factor = -1 + (2 * i) / (sampleCount - 1);
    const offsetKm = factor * radiusKm;
    
    const sampleLat = lat + offsetKm * latPerKm * 0.7071;
    const sampleLng = lng + offsetKm * lngPerKm * 0.7071;
    const sampleElev = getElevationAt(sampleLat, sampleLng);

    profilePoints.push({
      distanceKm: parseFloat(offsetKm.toFixed(2)),
      elevation: sampleElev,
      lat: parseFloat(sampleLat.toFixed(5)),
      lng: parseFloat(sampleLng.toFixed(5))
    });

    if (sampleElev < minElev) minElev = sampleElev;
    if (sampleElev > maxElev) maxElev = sampleElev;
    sumElev += sampleElev;
  }

  const meanElev = parseFloat((sumElev / sampleCount).toFixed(2));

  return {
    pointElevation: centerElev,
    slope: slopeDegrees,
    slopePercent,
    aspect: aspectDeg,
    aspectDirection: aspectDir,
    minElevation: parseFloat(minElev.toFixed(2)),
    maxElevation: parseFloat(maxElev.toFixed(2)),
    meanElevation: meanElev,
    profilePoints
  };
}

/**
 * Get the nearest survey control point to a location
 */
export function getNearestSurveyPoint(lat: number, lng: number): typeof SURVEY_CONTROL_POINTS[0] | null {
  let nearest = null;
  let minDistance = Infinity;

  for (const point of SURVEY_CONTROL_POINTS) {
    const dLat = lat - point.lat;
    const dLng = lng - point.lng;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = point;
    }
  }

  return nearest;
}

/**
 * Get all survey points within a radius of a location
 */
export function getSurveyPointsInRadius(lat: number, lng: number, radiusKm: number): typeof SURVEY_CONTROL_POINTS {
  const results: typeof SURVEY_CONTROL_POINTS = [];
  const radiusDeg = radiusKm * 0.009;

  for (const point of SURVEY_CONTROL_POINTS) {
    const dLat = lat - point.lat;
    const dLng = lng - point.lng;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng);
    if (distance <= radiusDeg) {
      results.push(point);
    }
  }

  return results;
}