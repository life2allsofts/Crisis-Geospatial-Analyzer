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

export const GHANA_HISTORICAL_FLOODS: HistoricalFloodEvent[] = [
  {
    id: "flood_2015_01",
    year: 2015,
    eventName: "June 3rd Accra Twin Disaster",
    regions: ["Greater Accra"],
    peopleDisplaced: 12000,
    deaths: 154,
    propertyDamage: "Catastrophic (Accra business district devastated)",
    trigger: "Extreme Torrential Rainfall & Drainage Blockage",
    severity: "CRITICAL",
    description: "An unprecedented three-day continuous rainfall caused the Odaw River basin to overflow. Severe flooding led to a catastrophic explosion at a Goil filling station in Circle, Accra, where victims had sought shelter.",
    source: "NADMO National Archive / Ghana Meteorological Agency"
  },
  {
    id: "flood_2018_01",
    year: 2018,
    eventName: "Bagre Dam Spillage Inundation",
    regions: ["Upper East", "Upper West", "Northern", "North East"],
    peopleDisplaced: 10500,
    deaths: 12,
    propertyDamage: "Severe (Acreage of staple food crops submerged)",
    trigger: "Bagre Dam Spillways Opening (Burkina Faso)",
    severity: "CRITICAL",
    description: "Emergency opening of the Bagre Dam gates in Burkina Faso due to torrential rains raised the White Volta River baseline rapidly, flooding surrounding low-lying farming communities in northern Ghana.",
    source: "White Volta Basin Board / NADMO"
  },
  {
    id: "flood_2020_01",
    year: 2020,
    eventName: "Greater Accra Seasonal Flooding",
    regions: ["Greater Accra", "Central"],
    peopleDisplaced: 6500,
    deaths: 5,
    propertyDamage: "Moderate to High (Residential properties submerged)",
    trigger: "Heavy Seasonal Monsoonal Downpours",
    severity: "HIGH",
    description: "Inundation of low-lying areas in the capital including Mallam, Kaneshie, and Circle. Blocked concrete channels and rapid urban surface runoff caused localized ponding for several days.",
    source: "Ghana Meteorological Agency / Accra Metropolitan Assembly"
  },
  {
    id: "flood_2021_01",
    year: 2021,
    eventName: "Kumasi Subin Basin Overflow",
    regions: ["Ashanti"],
    peopleDisplaced: 4200,
    deaths: 3,
    propertyDamage: "High (Kejetia Market basements and stores flooded)",
    trigger: "Subin River Urban Siltation & Flash Rain",
    severity: "HIGH",
    description: "Siltation and illegal structures along the Subin River path prevented free drainage flow, forcing flash runoff water into commercial sectors of central Kumasi.",
    source: "Kumasi Metropolitan Assembly / NADMO Ashanti"
  },
  {
    id: "flood_2022_01",
    year: 2022,
    eventName: "Eastern Region Hillside Floods",
    regions: ["Eastern"],
    peopleDisplaced: 3000,
    deaths: 2,
    propertyDamage: "Moderate (Road blockages and building foundation damage)",
    trigger: "Severe Slope Runoff & River Densu Siltation",
    severity: "MEDIUM",
    description: "Sustained heavy storms over Koforidua and surrounding hills led to rapid downhill streams flooding commercial centers, cutting off transit connections for over 48 hours.",
    source: "Eastern Region Hydrological Directorate"
  },
  {
    id: "flood_2023_01",
    year: 2023,
    eventName: "Akosombo Dam Controlled Spillage",
    regions: ["Volta", "Eastern", "Greater Accra"],
    peopleDisplaced: 39000,
    deaths: 0,
    propertyDamage: "Catastrophic (Total submersion of islands and coastal villages)",
    trigger: "Volta River Authority Controlled Spillways Opening",
    severity: "CRITICAL",
    description: "To safeguard the structural integrity of the Akosombo Dam during high reservoir inflow, VRA conducted high-volume water releases. This displaced over 39,000 residents in Mepe, Sogakope, and lower Volta estuary communities.",
    source: "Volta River Authority (VRA) / NADMO"
  },
  {
    id: "flood_2023_02",
    year: 2023,
    eventName: "Bagre Dam Seasonal releases",
    regions: ["Upper East", "North East", "Northern"],
    peopleDisplaced: 8500,
    deaths: 4,
    propertyDamage: "Severe (Washed away agricultural assets & bridges)",
    trigger: "Combined Local Monsoon & Bagre Dam Releases",
    severity: "HIGH",
    description: "Controlled releases from Burkina Faso coupled with intense localized northern storms flooded the White Volta plains, cutting off Bolgatanga and Bawku transit corridors.",
    source: "NADMO Upper East / White Volta Board"
  },
  {
    id: "flood_2024_01",
    year: 2024,
    eventName: "Keta Coastline Tidal Inundation",
    regions: ["Volta"],
    peopleDisplaced: 4500,
    deaths: 0,
    propertyDamage: "High (Coastal roads and primary schools flooded)",
    trigger: "High Tide Surge & Sea Level Rise",
    severity: "HIGH",
    description: "Strong high tides breached sandy coastal defense structures in the Keta municipality, leaving fishing hubs flooded under ocean saltwater for multiple weeks.",
    source: "Centre for Coastal Management / Volta NADMO"
  },
  {
    id: "flood_2025_01",
    year: 2025,
    eventName: "Kasoa & Central Region Flash Flood",
    regions: ["Central", "Greater Accra"],
    peopleDisplaced: 2100,
    deaths: 1,
    propertyDamage: "Moderate (Washed out temporary highway diversions)",
    trigger: "High-Intensity Flash Downpours",
    severity: "MEDIUM",
    description: "A sudden intense storm generated massive surface runoff over non-permeable urbanized hills in Kasoa and Senya Bereku, flooding key road infrastructure and markets.",
    source: "Central Region Disaster Coordination Centre"
  }
];
