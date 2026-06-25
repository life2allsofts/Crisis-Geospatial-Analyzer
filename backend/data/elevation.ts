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
 * High-fidelity mathematical Digital Elevation Model (DEM) for Ghana.
 * Uses real geographic reference points to interpolate regional base elevation
 * and combines multi-frequency sinusoidal waves to simulate realistic local topography,
 * slopes, aspects, and elevation cross-sections.
 */
export function getElevationAt(lat: number, lng: number): number {
  // 1. Regional Base Elevation Model for Ghana
  // Coastal Lowlands: lat ~ 5.5, elevation ~ 5-25m
  // Volta River Plains: lat ~ 6.0, lng ~ 0.6, elevation ~ 10-15m
  // Kumasi Plateau: lat ~ 6.7, lng ~ -1.6, elevation ~ 260-310m
  // Tamale Savannah: lat ~ 9.4, lng ~ -0.8, elevation ~ 150-180m
  // Kwahu Plateau (Highlands): lat ~ 6.6, lng ~ -0.7, elevation ~ 450-550m
  // Akwapim Hills (Northeast Accra): lat ~ 5.9, lng ~ -0.1, elevation ~ 350-450m

  const referencePoints = [
    { lat: 5.5414, lng: -0.2198, elevation: 8, weight: 1.5, name: "Coastal" }, // Accra Coast
    { lat: 5.5891, lng: -0.2145, elevation: 12, weight: 1.2, name: "Odaw Bowl" }, // Circle
    { lat: 5.5682, lng: -0.2854, elevation: 65, weight: 1.0, name: "Weija Hills" }, // Weija Gbawe hills
    { lat: 5.9200, lng: -0.1200, elevation: 320, weight: 1.5, name: "Akwapim Ridge" }, // Aburi / Hills
    { lat: 5.9875, lng: 0.6120, elevation: 11, weight: 1.8, name: "Lower Volta" }, // Mepe
    { lat: 6.6948, lng: -1.6144, elevation: 280, weight: 1.4, name: "Kumasi" }, // Kumasi Center
    { lat: 6.6000, lng: -0.7000, elevation: 490, weight: 1.6, name: "Kwahu Plateau" }, // Mampong / Highlands
    { lat: 7.0000, lng: -0.1000, elevation: 85, weight: 2.0, name: "Lake Volta" }, // Lake basin
    { lat: 9.3824, lng: -0.8354, elevation: 165, weight: 1.5, name: "Tamale" }, // Tamale
    { lat: 11.1000, lng: -0.5000, elevation: 210, weight: 1.2, name: "Northern Border" } // Bagre Dam / Upper East
  ];

  // Inverse Distance Weighting (IDW) for smooth regional base elevation
  let totalWeight = 0;
  let weightedElevationSum = 0;
  const power = 2.0;

  for (const p of referencePoints) {
    const dLat = lat - p.lat;
    const dLng = lng - p.lng;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng) || 0.001;
    const w = p.weight / Math.pow(distance, power);
    weightedElevationSum += p.elevation * w;
    totalWeight += w;
  }

  let baseElevation = weightedElevationSum / totalWeight;

  // 2. Multi-frequency fractal topologic wave simulation for local topography
  // We customize amplitude and frequency based on region to match real landform structures!
  
  // Detect if in the flat delta (Sogakope/Mepe/Coastal)
  const distToMepe = Math.sqrt(Math.pow(lat - 5.9875, 2) + Math.pow(lng - 0.6120, 2));
  const distToCoast = Math.abs(lat - 5.48); // distance to ocean
  const isPlainRegion = distToMepe < 0.4 || (lat < 5.6 && distToCoast < 0.15);

  let hillAmplitude1 = 45;   // Mid-range hills (wavelength ~ 8km)
  let hillAmplitude2 = 12;   // Local ridges (wavelength ~ 1.5km)
  let bumpAmplitude = 3.5;   // Micro bumps (wavelength ~ 250m)

  if (isPlainRegion) {
    // Dampen amplitude in plains/estuaries to simulate extremely flat terrain (Lower Volta / Coastal lagoons)
    hillAmplitude1 = 6;
    hillAmplitude2 = 1.5;
    bumpAmplitude = 0.4;
  } else if (lat > 5.75 && lat < 6.1 && lng > -0.2 && lng < 0.0) {
    // Escalate ruggedness in Akwapim Ridge zone
    hillAmplitude1 = 95;
    hillAmplitude2 = 25;
    bumpAmplitude = 6.0;
  } else if (Math.abs(lat - 6.6948) < 0.3 && Math.abs(lng - (-1.6144)) < 0.3) {
    // Kumasi rolling hills terrain
    hillAmplitude1 = 40;
    hillAmplitude2 = 18;
    bumpAmplitude = 5.0;
  }

  // Continuous multi-frequency 2D sine/cosine wave functions (completely deterministic based on lat/lng)
  const term1 = Math.sin(lat * 120) * Math.cos(lng * 120);
  const term2 = Math.cos(lat * 520 + 0.5) * Math.sin(lng * 480 - 0.2);
  const term3 = Math.sin(lat * 3200) * Math.sin(lng * 3500);

  const localTopography = 
    term1 * hillAmplitude1 + 
    term2 * hillAmplitude2 + 
    term3 * bumpAmplitude;

  let finalElevation = baseElevation + localTopography;

  // Enforce realistic bounds (cannot be below sea level, except specifically in parts of Keta Lagoon or salt flats, clamp to minimum 0.5m)
  if (finalElevation < 0.5) {
    finalElevation = 0.5 + Math.abs(Math.sin(lat * 10000) * 1.5); // sea-level beach/lagoon ripples
  }

  return parseFloat(finalElevation.toFixed(2));
}

// Converts compass angle (0-360) to human readable direction
export function getCompassDirection(degrees: number): string {
  const directions = [
    "North ⬆️", "North-East ↗️", "East ➡️", "South-East ↘️",
    "South ⬇️", "South-West ↙️", "West ⬅️", "North-West ↖️"
  ];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}

/**
 * Calculates slope, aspect, min, max, and generates an elevation cross-section profile.
 */
export function getElevationProfile(
  lat: number,
  lng: number,
  bufferRadiusMeters: number
): ElevationProfile {
  const centerElev = getElevationAt(lat, lng);

  // 1. Analytical Slope & Aspect calculation using 4 cardinal samples at 30m distance
  // 30 meters is approx 0.00027 degrees in lat/lng at the equator
  const deltaDegrees = 0.00027; 
  const deltaMeters = 30;

  const z_n = getElevationAt(lat + deltaDegrees, lng);
  const z_s = getElevationAt(lat - deltaDegrees, lng);
  const z_e = getElevationAt(lat, lng + deltaDegrees);
  const z_w = getElevationAt(lat, lng - deltaDegrees);

  // Partial derivatives in meters
  // dx is East-West, dy is North-South
  const dz_dx = (z_e - z_w) / (2 * deltaMeters);
  const dz_dy = (z_n - z_s) / (2 * deltaMeters);

  const slopeGrad = Math.sqrt(dz_dx * dz_dx + dz_dy * dz_dy);
  const slopePercent = parseFloat((slopeGrad * 100).toFixed(2));
  const slopeDegrees = parseFloat((Math.atan(slopeGrad) * (180 / Math.PI)).toFixed(2));

  // Aspect (0 to 360 degrees)
  let aspectDeg = 0;
  if (dz_dx !== 0 || dz_dy !== 0) {
    // atan2(dx, dy) returns angle relative to East. We adjust to geographic North (0 is North)
    const angleRad = Math.atan2(dz_dx, dz_dy);
    aspectDeg = (angleRad * (180 / Math.PI) + 360) % 360;
  }
  aspectDeg = parseFloat(aspectDeg.toFixed(1));
  const aspectDir = getCompassDirection(aspectDeg);

  // 2. Elevation profile sampling along a Southwest-to-Northeast diagonal cut across the buffer zone
  // Southwest corner to Northeast corner of the buffer area
  const radiusKm = bufferRadiusMeters / 1000;
  const sampleCount = 9; // odd number so center is exactly index 4
  const profilePoints: ElevationProfile["profilePoints"] = [];
  
  let minElev = centerElev;
  let maxElev = centerElev;
  let sumElev = 0;

  // Degrees of latitude per km is approx 1/111 = 0.009
  // Degrees of longitude per km is approx 1/111 * cos(lat) ~ 0.009
  const latPerKm = 0.009;
  const lngPerKm = 0.009;

  for (let i = 0; i < sampleCount; i++) {
    // Interpolate multiplier from -1 (SW boundary) to +1 (NE boundary)
    const factor = -1 + (2 * i) / (sampleCount - 1);
    const offsetKm = factor * radiusKm;
    
    // Diagonal offset
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
