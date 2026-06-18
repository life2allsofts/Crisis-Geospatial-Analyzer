/**
 * Geomatics Utilities in Ghana
 * Approximates UTM Zone 30N / Ghana National Grid coordinate transformations.
 * Reference: WGS 84, Central Meridian 3 West (UTM Zone 30N).
 */

export interface UtmCoordinates {
  easting: number;
  northing: number;
  zone: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Converted UTM Zone 30N coordinates directly to WGS84 decimal degrees.
 * This utilizes a simplified Transverse Mercator projection formula suited for mid-Ghana accuracy.
 */
export function utm30NToLatLng(easting: number, northing: number): LatLng {
  // Constants for WGS84 reference ellipsoid in UTM 30N (central meridian = -3)
  const a = 6378137.0; // semi-major axis
  const f = 1 / 298.257223563; // flattening
  const k0 = 0.9996; // scale factor
  const eastingOffset = 500000.0; // false easting
  const centralMeridian = -3.0; // Central Meridian in degrees for Zone 30

  const b = a * (1 - f);
  const esq = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(a, 2);
  const ePrimeSq = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(b, 2);

  const x = easting - eastingOffset;
  const y = northing;

  // Compute intermediate footprint latitude
  const m = y / k0;
  const mu = m / (a * (1 - esq / 4 - (3 * esq * esq) / 64 - (5 * esq * esq * esq) / 256));

  const e1 = (1 - Math.sqrt(1 - esq)) / (1 + Math.sqrt(1 - esq));
  const j1 = (3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32;
  const j2 = (21 * Math.pow(e1, 2)) / 16 - (55 * Math.pow(e1, 4)) / 32;
  const j3 = (151 * Math.pow(e1, 3)) / 96;

  const fp = mu + j1 * Math.sin(2 * mu) + j2 * Math.sin(4 * mu) + j3 * Math.sin(6 * mu);

  const fpRad = fp;
  const sinFp = Math.sin(fpRad);
  const cosFp = Math.cos(fpRad);
  const tanFp = Math.tan(fpRad);

  const radiusOfCurvaturePrimary = a / Math.sqrt(1 - esq * Math.pow(sinFp, 2));
  const radiusOfCurvatureMeridian = radiusOfCurvaturePrimary * (1 - esq) / (1 - esq * Math.pow(sinFp, 2));

  // Compute coordinate adjustments
  const d = x / (radiusOfCurvaturePrimary * k0);

  const latRad = fpRad - (radiusOfCurvaturePrimary * tanFp / radiusOfCurvatureMeridian) * 
    (Math.pow(d, 2) / 2 - (5 + 3 * Math.pow(tanFp, 2) + 10 * ePrimeSq * Math.pow(cosFp, 2) - 4 * Math.pow(ePrimeSq, 2) - 9 * ePrimeSq) * Math.pow(d, 4) / 24);

  const lngRad = (d - (1 + 2 * Math.pow(tanFp, 2) + ePrimeSq) * Math.pow(d, 3) / 6 + 
    (5 - 2 * ePrimeSq + 28 * Math.pow(tanFp, 2) - 3 * Math.pow(ePrimeSq, 2) + 8 * ePrimeSq * Math.cos(fpRad) * Math.cos(fpRad) + 24 * Math.pow(tanFp, 4)) * Math.pow(d, 5) / 120) / cosFp;

  // Convert to degrees and adjust for Central Meridian
  const latValue = (latRad * 180) / Math.PI;
  const lngValue = centralMeridian + (lngRad * 180) / Math.PI;

  return {
    lat: parseFloat(latValue.toFixed(6)),
    lng: parseFloat(lngValue.toFixed(6))
  };
}

/**
 * Validates Ghana boundaries to trigger warnings if target lands on wrong coordinates.
 */
export function isCoordinateInGhana(lat: number, lng: number): boolean {
  return lat >= 4.5 && lat <= 11.5 && lng >= -3.5 && lng <= 1.5;
}
