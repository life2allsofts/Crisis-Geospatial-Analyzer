export interface FloodZone {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lng: number }; // Center
  radiusKm: number; // Hazard radius
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  historicalContext: string;
  source: string;
}

export const GHANA_FLOOD_ZONES: FloodZone[] = [
  {
    id: "acc_korle_01",
    name: "Korle Lagoon Outlet & Odaw Basin",
    region: "Greater Accra Region (Accra)",
    coordinates: { lat: 5.5414, lng: -0.2198 },
    radiusKm: 2.5,
    severity: "CRITICAL",
    description: "Highly urbanized low-lying area. Receives primary runoff from the Odaw River basin. Severe seasonal overflow during monsoon seasons.",
    historicalContext: "Extreme runoff channel of the infamous June 3rd flood disaster. Prone to severe plastic pollution blockages and storm surges.",
    source: "Ghana Hydrological Services Department / NADMO"
  },
  {
    id: "acc_mallam_02",
    name: "Mallam & Gbawe Valley",
    region: "Greater Accra Region (Weija-Gbawe)",
    coordinates: { lat: 5.5682, lng: -0.2854 },
    radiusKm: 1.8,
    severity: "HIGH",
    description: "Low-lying settlement channel below the Weija Dam watershed. Characterized by high siltation and poor drainage.",
    historicalContext: "Subject to structural flooding whenever Weija Dam spillways are opened to protect integrity.",
    source: "Ghana Hydrological Services Department"
  },
  {
    id: "acc_alajo_03",
    name: "Alajo, Circle & Kaneshie Intersection",
    region: "Greater Accra Region (Accra)",
    coordinates: { lat: 5.5891, lng: -0.2145 },
    radiusKm: 2.0,
    severity: "CRITICAL",
    description: "Confluence point of major Accra drains. High concentration of commercial and residential structures directly exposed to Odaw River overflows.",
    historicalContext: "Subject to immediate flash flooding within 30 minutes of heavy precipitations (>50mm).",
    source: "Ghana Hydrological Services Department"
  },
  {
    id: "vlt_mepe_01",
    name: "Mepe Lower Volta Basin",
    region: "Volta Region (South Tongu / North Tongu)",
    coordinates: { lat: 5.9875, lng: 0.6120 },
    radiusKm: 4.5,
    severity: "CRITICAL",
    description: "Riparian flood plain directly adjacent to the lower Volta River. Sandy and silted soils with ultra-low slope gradients.",
    historicalContext: "Devastated by the historic late-2023 controlled spillage from the Akosombo and Kpong dams, displacing over 30,000 residents and inundating farmland.",
    source: "Volta River Authority (VRA) / NADMO"
  },
  {
    id: "vlt_sogakope_02",
    name: "Sogakope Wetland & Estuary Buffer",
    region: "Volta Region (South Tongu/Ada East)",
    coordinates: { lat: 5.9984, lng: 0.5968 },
    radiusKm: 3.5,
    severity: "HIGH",
    description: "Estuary backup zone where Volta River discharge meets high tide of the Atlantic Ocean. Slow water drainage rates.",
    historicalContext: "Prone to tidal backwaters and high-discharge riverine flooding. Strongly impacted by Akosombo water release schedules.",
    source: "Volta River Authority (VRA)"
  },
  {
    id: "ks_aboabo_01",
    name: "Aboabo & Subin Basin",
    region: "Ashanti Region (Kumasi)",
    coordinates: { lat: 6.6948, lng: -1.6144 },
    radiusKm: 1.5,
    severity: "HIGH",
    description: "Kumasi central drainage channel. Dense market district surrounding the Subin River. Extreme runoff concentration.",
    historicalContext: "Kumasi central market and Aboabo drains frequently overflow during peak storms, trapping commercial activities and damaging goods.",
    source: "Ghana Hydrological Authority / Kumasi Metropolitan Assembly"
  },
  {
    id: "nt_tamale_01",
    name: "Tamale South Lowland Plains",
    region: "Northern Region (Tamale)",
    coordinates: { lat: 9.3824, lng: -0.8354 },
    radiusKm: 3.0,
    severity: "MEDIUM",
    description: "Plains prone to rapid saturation during the northern single peak rainy season. Poor clayey soil infiltration rates.",
    historicalContext: "Vulnerable to extreme meteorological flooding, compounded by Bagre Dam spillages from Burkina Faso that raise country-wide river baselines.",
    source: "Northern Region Hydrological Directorate"
  }
];
