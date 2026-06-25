export interface ClimateScenario {
  id: string;
  name: string;
  description: string;
  rainfallFactor: number;       // Multiplier for rainfall / runoff severity
  radiusMultiplier: number;     // Multiplier for exposure buffer radius calculations
  displacementCoef: number;     // Multiplier for population displacement / vulnerability scaling
}

export const CLIMATE_SCENARIOS: ClimateScenario[] = [
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
