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
  },
  {
    id: "wst_tarkwa_01",
    name: "Tarkwa Gold Mining Valley",
    region: "Western Region (Tarkwa-Nsuaem)",
    coordinates: { lat: 5.3014, lng: -2.0024 },
    radiusKm: 2.5,
    severity: "HIGH",
    description: "Heavy tropical downpour zones with extensive alluvial gold mining pits and channels. Localized siltation causes extreme drainage path narrowing.",
    historicalContext: "Amona and Bonsa rivers regularly overflow due to illegal mining silt accumulation, inundating nearby agricultural lands and mine shafts.",
    source: "Environmental Protection Agency (EPA) Ghana / Minerals Commission"
  },
  {
    id: "wst_takoradi_02",
    name: "Sekondi-Takoradi Coastal Storm Buffer",
    region: "Western Region (Sekondi-Takoradi)",
    coordinates: { lat: 4.8871, lng: -1.7485 },
    radiusKm: 2.0,
    severity: "HIGH",
    description: "Vulnerable coastal urban zone. High exposure to extreme Atlantic wave action, high-tide backup in Whin River basin, and urban runoff.",
    historicalContext: "Prone to severe tidal inundations and coastal flooding. The low-lying sections of Takoradi Port and nearby shanties suffer frequent storm surges.",
    source: "Ghana Meteorological Agency / NADMO"
  },
  {
    id: "ue_bolga_01",
    name: "Bolgatanga White Volta Floodplain",
    region: "Upper East Region (Bolgatanga)",
    coordinates: { lat: 10.7856, lng: -0.8514 },
    radiusKm: 3.5,
    severity: "CRITICAL",
    description: "Extremely flat terrain directly in the flow line of the White Volta River. Vulnerable to direct riverine flooding.",
    historicalContext: "Historically decimated when seasonal rainfall spikes occur in tandem with Burkina Faso's Bagre Dam controlled releases, sweeping away thousands of acres of farmland.",
    source: "White Volta Basin Board / NADMO"
  },
  {
    id: "uw_wa_01",
    name: "Wa South Lowland Basin",
    region: "Upper West Region (Wa)",
    coordinates: { lat: 9.8974, lng: -2.5085 },
    radiusKm: 2.2,
    severity: "MEDIUM",
    description: "Flat terrain with low clayey soil infiltration rates. Water collects in depressions during intense northern thunderstorms.",
    historicalContext: "Severe road cutoffs and agricultural washouts during the single peak rainy season (August/September). Localized bridge damage is common.",
    source: "Upper West Hydrological Directorate"
  },
  {
    id: "cr_capecoast_01",
    name: "Cape Coast Coastal Erosion Belt",
    region: "Central Region (Cape Coast)",
    coordinates: { lat: 5.1053, lng: -1.2464 },
    radiusKm: 1.8,
    severity: "HIGH",
    description: "A high-erosion sandy coastline with rising sea levels. High risk of tidal inundations and severe wave-driven damage during spring tides.",
    historicalContext: "Historic structures and fishing communities along the coastline suffer gradual land loss, with recent storms causing direct property destruction.",
    source: "Centre for Coastal Management, UCC"
  },
  {
    id: "cr_kasoa_02",
    name: "Kasoa Akweley Drain Junction",
    region: "Central Region (Kasoa)",
    coordinates: { lat: 5.5424, lng: -0.4215 },
    radiusKm: 2.0,
    severity: "HIGH",
    description: "Rapidly expanding urban zone with massive non-permeable concrete footprints and blocked secondary drainage networks.",
    historicalContext: "Experiencing rapid development. Severe runoff regularly covers the main highway, causing massive traffic lockups and business inundation.",
    source: "Kasoa Municipal Assembly"
  },
  {
    id: "er_koforidua_01",
    name: "Koforidua Nsukwao Basin",
    region: "Eastern Region (Koforidua)",
    coordinates: { lat: 6.0945, lng: -0.2591 },
    radiusKm: 1.8,
    severity: "HIGH",
    description: "Hilly terrain surrounding the Nsukwao stream. Intense slope runoff pools rapidly in the city center where drainage channels are undersized.",
    historicalContext: "Severe urban flash floods occur within hours of rainfall, with water flowing through commercial streets and damaging electrical setups.",
    source: "New Juaben South Municipal Assembly"
  },
  {
    id: "sv_buipe_01",
    name: "Buipe Black Volta Crossing",
    region: "Savannah Region (Buipe)",
    coordinates: { lat: 8.7845, lng: -1.5423 },
    radiusKm: 3.2,
    severity: "HIGH",
    description: "Key river crossing point on the Black Volta. Naturally flat floodplains with heavy industrial and logistics hub exposure.",
    historicalContext: "Experienced massive inundation in recent years, which flooded local cement factories, displaced thousands of residents, and cut off key North-South road linkages.",
    source: "Savannah River Authority / NADMO"
  },
  {
    id: "ot_nkwanta_01",
    name: "Nkwanta River Siltation Zone",
    region: "Oti Region (Nkwanta)",
    coordinates: { lat: 8.2575, lng: 0.5214 },
    radiusKm: 2.0,
    severity: "MEDIUM",
    description: "Undulating and mountainous terrain of the Oti region. Heavy rainfall drains rapidly from steep slopes into narrow silted river basins.",
    historicalContext: "Silted rivers overflow into cocoa and cassava farms, cutting off rural access roads and isolating farming communities.",
    source: "Oti Regional Directorate / MOFA"
  },
  {
    id: "ah_goaso_01",
    name: "Goaso Tano River Basin",
    region: "Ahafo Region (Goaso)",
    coordinates: { lat: 6.8041, lng: -2.5183 },
    radiusKm: 2.0,
    severity: "MEDIUM",
    description: "Dense agricultural region centered on the Tano River. Affected by high seasonal water baselines and timber-logged channels.",
    historicalContext: "Agricultural fields and surrounding settlements experience seasonal pooling, damaging cocoa nurseries and delaying harvest transport.",
    source: "Ahafo Regional Hydrological Directorate"
  }
];
