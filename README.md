---
title: Ghana Crisis Geospatial Analyzer
emoji: 🌍
colorFrom: red
colorTo: pink
sdk: docker
sdk_version: "1.0"
pinned: false
license: mit
app_port: 7860
---
# 🌍 Ghana Crisis Geospatial Analyzer

> AI-powered geospatial crisis response system for Ghana with RAG-based reasoning, custom color themes, and interactive mapping.

[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97-View%20on%20Hugging%20Face-yellow)](https://huggingface.co/Tetteh-Apotey)
[![Node.js 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-blue.svg)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-green.svg)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     SPA React Client                      │  │
│  │                    (frontend/src/App)                     │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  Components: MapView, ControlPanel, ResultsDisplay        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ [REST JSON API]
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 Express REST API Router                   │  │
│  │                  (backend/api/routes.ts)                  │  │
│  └────────────────────────────┬──────────────────────────────┘  │
│                               │                                 │
│            ┌──────────────────┴──────────────────┐              │
│            ▼                                     ▼              │
│  ┌────────────────────┐                ┌────────────────────┐   │
│  │ Geospatial Engine  │                │    Gemini LLM      │   │
│  │  (Point-in-Poly)   │                │   (3.5-flash RAG)  │   │
│  └─────────┬──────────┘                └─────────┬──────────┘   │
└────────────┼─────────────────────────────────────┼──────────────┘
             │                                     │
             ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       STATIC DATA LAYER                         │
│  ┌────────────────────┐                ┌────────────────────┐   │
│  │  Ghana Flood Zones │                │ WorldPop/OSM Stats │   │
│  │ (ghana_flood_zones)│                │     (Calculated)   │   │
│  └────────────────────┘                └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌──────────────┐
│ User Input   │
│ (lat, lon)   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ 1. Validate Coordinates                     │
│    • Range bounds checks                    │
│    • Ghana bounding limits verification     │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ 2. Geospatial Analysis (backend/core/)      │
│    • Match against Ghana Flood Zones list   │
│    • Geodesic buffer calculations (km)      │
│    • Zonal human & structural exposures    │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ 3. LLM RAG Context Assembly                 │
│    • Retrieve closest hazardous zones       │
│    • Bind topologic & historic variables    │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ 4. Gemini SDK Reasoning                     │
│    • Evaluate local hazards                 │
│    • Generate structured JSON responses     │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ 5. Client View Render                       │
│    • Update dynamic Theme Selection         │
│    • Paint Leaflet mapping rings            │
│    • Display color-coded threat meters      │
└─────────────────────────────────────────────┘
```

### Key Architectural Innovations

#### 📱 State-Driven Multi-Screen Navigation
The user interface implements a responsive, state-driven navigation router inside `App.tsx` designed to optimize screen real estate and deliver deep analytical focuses:
* **Dashboard Mode (`activeScreen === "map"`)**: Centers the Leaflet map and control parameters with a high-level visual vulnerability summary banner side-by-side (desktop) or stacked (mobile).
* **Focused Analytics Mode (`activeScreen !== "map"`)**: Dynamically swaps out the control-and-map grid for a dedicated, full-width focus viewport (e.g., *Exposure & Terrain*, *Generative AI Report*, *Safe Havens & Routes*). Features a custom navigation header with a coordinates readout, a single-click return mechanism, and the full analytical panels.
* **Dashboard Quick-Link Tiles**: Integrated directly into the primary results card when in Dashboard mode, these interactive cards provide quick-access links to swap views instantly.

#### 🛡️ Resilient LLM Failover Architecture
To ensure 100% system availability during periods of heavy usage or external API service interruptions (such as Gemini API `429 RESOURCE_EXHAUSTED` rate limits/quotas), the backend employs a robust fallback pipeline:
* **Graceful Exception Catching**: In `backend/core/llm_service.ts`, the model invocation is wrapped in a resilient try-catch handler.
* **Geospatial Heuristics Generator**: If the external Gemini endpoint fails, the system triggers a local, high-fidelity geospatial heuristics generator.
* **Dynamic Content Interpolation**: The fallback engine synthesizes raw spatial data—including exact coordinates, center elevation (meters ASL), interpolated slope profiles, closest hazard zones, and selected simulated climate parameters—to produce a complete, scientifically accurate, and cohesive hazard assessment report layout layout instantaneously, ensuring uninterrupted service.

---

## 📁 Project Structure

```
/
├── .env.example                         # Environment variables template
├── .gitignore                           # Git ignore rules
├── .github/
│   └── workflows/
│       └── ci-cd.yml                    # GitHub Actions CI/CD pipeline
│
├── Dockerfile                           # HF Spaces Docker configuration
├── package.json                         # NPM dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite build configuration
├── server.ts                            # Production server entry point
├── index.html                           # HTML entry point
│
├── backend/                             # Backend server logic
│   ├── api/
│   │   ├── index.ts                     # API entry exports
│   │   └── routes.ts                    # Express route handlers
│   │
│   ├── core/
│   │   ├── index.ts                     # Core exports wrapper
│   │   ├── geospatial.ts                # GIS & coordinate calculations
│   │   ├── llm_service.ts               # Gemini AI integration using official SDK
│   │   └── rag_retriever.ts             # RAG Context building with Ghana floodplains
│   │
│   └── data/
│       ├── index.ts                     # Data exports wrapper
│       ├── elevation.ts                 # Ghana elevation grid and DEM interpolation functions
│       └── ghana_flood_zones.ts         # Ghana hydrological datasets
│
└── frontend/                            # React frontend
    └── src/
        ├── App.tsx                      # Main React shell organizing state, themes & layout
        ├── main.tsx                     # React rendering entry bootstrap
        ├── index.css                    # Tailwind CSS configuration imports
        ├── types.ts                     # Component types & coordinate signatures
        │
        ├── components/
        │   ├── index.ts                 # Export wrapper for all modular elements
        │   ├── MapView.tsx              # Interactive map rendering with Leaflet
        │   ├── ControlPanel.tsx         # Coordinates converter & slider inputs controller
        │   └── ResultsDisplay.tsx       # AI and GIS metrics outputs report card
        │
        └── utils/
            ├── index.ts                 # Utilities exports wrapper
            ├── geoUtils.ts              # Transverse Mercator (Grid 30N) conversions
            └── apiClient.ts             # Client API fetching helpers
```

---

## 📄 File Descriptions

| Directory / File Path | Description |
|:---|:---|
| **`Dockerfile`** | Pre-configured multi-stage alpine container setup specifically designed to bind to port 7860 for Hugging Face Spaces. |
| **`.github/workflows/ci-cd.yml`** | Fully automated CD script containing code evaluation, custom Node-based spatial simulation tests, compile workflows, and GitHub-to-HuggingFace repository syncing logic. |
| **`server.ts`** | Production server. Delivers the client SPA assets during production and attaches custom Express API middleware layers (`/api`) dynamically. |
| **`backend/api/routes.ts`** | Handles geographical requests, coordinate bounds, and prompts. Exposes `/api/analyze`, `/api/safe-havens`, and `/api/historical-events` endpoints. |
| **`backend/core/safe_haven.ts`** | Nearest safe havens locator utilizing Haversine distance calculations. |
| **`backend/data/safe_havens.ts`** | Curated list of NADMO-certified safe havens across all regions of Ghana, complete with coordinates, capacity, and recommended routes. |
| **`backend/data/historical_floods.ts`** | Structured event registry of historical inundations, displacements, and casualties spanning 2015-2025 across key regions in Ghana. |
| **`backend/core/geospatial.ts`** | Computes topological math such as population exposure counts on WorldPop dataset estimations, building asset overlaps, and regional road network statistics. |
| **`backend/core/llm_service.ts`** | Feeds zonal metrics, historical reference contexts, and terrain slope/elevation properties to Structured Gemini Flash LLM to obtain precise mitigation plans and scientific breakdowns. |
| **`backend/core/rag_retriever.ts`** | Looks up the geographically closest risk-prone physical plane, calculating exact spatial distances and historic notes for inclusion in RAG contexts. |
| **`backend/data/elevation.ts`** | Realizes a high-fidelity Digital Elevation Model (DEM) for Ghana using Inverse Distance Weighting interpolation and continuous fractals to model slopes, aspect headings, and elevation profiles. |
| **`backend/data/ghana_flood_zones.ts`** | Stores coordinate centroids, risk classifications, and historic hydrological descriptions of major plains (Akwapim, Odaw Basin, Akosombo spillways, etc.) in Ghana. |
| **`frontend/src/App.tsx`** | Coordinates the global theme state selector, layout templates, parameter changes, active coordinates, and user interactiveness. |
| **`frontend/src/components/MapView.tsx`** | Leaflet-centered interactive map. Plots hazard buffer guidelines, target centroids, and listens to user coordinate clicks. |
| **`frontend/src/components/ControlPanel.tsx`** | Custom input component. Includes coordinate toggle cards (WGS-84 coordinate coordinates or UTM-30N Grid meters), target selections, and geographical radius sliders. |
| **`frontend/src/components/ResultsDisplay.tsx`** | Consolidates and renders output results. Houses metrics counters, structural metrics checklists, and collapsible checkboxes for evacuation recommendations. Supports 5 interactive tabs including Live Safe Havens and Historical Timelines. |
| **`frontend/src/components/SafeHavens.tsx`** | High-fidelity safe haven metrics cards listing details and interactive NADMO Regional Emergency Hotline directory lookup. |
| **`frontend/src/components/TimelineChart.tsx`** | Interactive historical trend visualizer utilizing Recharts to render displacement curves and fatalities over a 2015-2025 temporal scale. |
| **`frontend/src/utils/pdfGenerator.tsx`** | Client-side publication-quality PDF compiler utilizing `@react-pdf/renderer`. Houses formatted NADMO-branded heading styles, tables, and declarative multi-page layout configurations. |
| **`frontend/src/utils/geoUtils.ts`** | Conducts standard mathematical conversion from UTM Zone 30N (Ghana National Grid UTM format) to generic lat/lng decimals. |
| **`frontend/src/utils/apiClient.ts`** | Client interface wrapper that performs standardized network HTTP fetches to backend route paths. |

---

## 🚀 Quick Start Guide

### Running Locally

To run the full-stack development workspace on your local engine:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Secret Keys**
   Create a `.env` configuration file in the project's root folder:
   ```env
   GEMINI_API_KEY="your-google-gemini-api-key"
   NODE_ENV="development"
   PORT=3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` inside your preferred browser.

---

### Running in Production

In production configurations, Vitest asset builds are compiled and served by Node:

1. **Build Client & Server Assets**
   ```bash
   npm run build
   ```
   *This compiles client-side code into static files within `/dist` and bundles the core server-side modules down to `/dist/server.cjs` via esbuild.*

2. **Launch Production Server**
   ```bash
   npm start
   ```
   The application binds to port `3000` (or the configured `PORT` environment value) automatically.

---

## 📘 Usage Guide

Follow these sequential steps to perform a complete geospatial risk analysis and interpret the results correctly:

### 1. Inputting Coordinates
You can target any regional area inside Ghana using three different methods of input:
* **Interactive Map Clicks**: Scroll, zoom, and select any location on the integrated map. A simple left-click on the map automatically extracts the location's decimal coordinates (Latitude/Longitude in WGS-84 format), centers the marker, and prompts the backend calculation pipelines.
* **Geographical Presets**: Locate the **Target Ghana Floodplains** panel. Click on the header to expand the presets list, and select from a complete list of 15+ comprehensive nationwide presets spanning all key regions of Ghana (e.g., *Odaw River Basin*, *Akosombo Spillway Zone*, *Tarkwa Gold Mining Valley* in the Western Region, *Bolgatanga White Volta Plain* in the Upper East, *Cape Coast Erosion Belt* in the Central Region, *Buipe Crossing* in Savannah, and *Koforidua Nsukwao Basin* in the Eastern Region). This panel is fully collapsible to maximize the available space on smaller screens.
* **Manual Input (WGS-84 format)**:
  1. Click the **WGS-84** button in the Control Panel.
  2. Enter the decimal degrees directly (e.g. Latitude: `5.5891`, Longitude: `-0.2145` for Central Accra).
  3. Click **Analyze Geographic Site** to initiate.

### 2. Using the UTM to WGS-84 Converter
Ghanaian local agencies often use grid coordinates based on the Transverse Mercator (UTM Zone 30N) projection. You can convert these grid metrics to standard global coordinates interactively:
1. Select the **UTM-30N** button located on the coordinate mode switch trigger in the Control Panel.
2. Under **Easting (X)**, input the local easting coordinate in meters (e.g., `255146` or standard 6-digit grid numbers).
3. Under **Northing (Y)**, input the local northing coordinate in meters (e.g., `617942` or standard 6-digit grid numbers).
4. Click **Convert Grid & Analyze**.
5. The system will convert your input values mathematically using our transverse Mercator algorithms, fill the Latitude/Longitude boxes under the WGS-84 tab, select WGS-84 mode, reposition the Map pin, and trigger the analysis workflow immediately.

### 3. Simulated Climate Scenarios (What-If Stress Testing)
Disaster planners can move beyond static perspectives and simulate distinct environmental or structural failure events:
1. Locate the **Climate Scenario Simulation** dropdown inside the Vulnerability Controls panel.
2. Choose one of our predefined climate situations:
   * **Standard Baseline**: Standard historical annual average rainfall and average drainage runoffs.
   * **Heavy Seasonal Monsoon**: Simulates intense tropical downpours over 72 hours, scaling rainfall factor by 1.5x and the buffer exposure radius by 1.2x.
   * **Bagre Dam Spillway Release**: Simulates heavy transboundary dam spillway releases, scaling rainfall intensity by 1.8x and expanding the buffer radius by 1.5x.
   * **100-Yr Climate Storm Supercell**: Simulates extreme, unprecedented storm cells, scaling rainfall by 2.5x and the buffer radius by 2.0x.
3. When a scenario is selected, its multipliers scale the underlying geospatial calculation engine immediately.
4. Review the **Projected Evacuees** card in the results console, which estimates total human displacement based on a scenario-specific population displacement coefficient (up to 3.5x).
5. The selected scenario parameters are dynamically passed into the Gemini LLM prompt so that the generative intelligence report adapts its reasoning and recommends specific emergency actions.

### 4. Interpreting the Assessment Results
Once the calculations complete, the results are organized into an interactive, modular tabbed console to avoid clutter and display key information on demand:

* **General Vulnerability Banner (Always Visible)**:
  * Displays a color-coded risk threat level: `🟢 LOW` (standard suburban drainage behaviors), `🟡 MEDIUM` (low-level active hazard profile), `🟠 HIGH` (potential flooding reach), or `🔴 CRITICAL` (direct floodplain overlap).
  * Outlines the exact zonal proximity (in kilometers) to the nearest high-risk river basin, lagoon, or dam.

* **Exposure & Assets Tab**:
  * **Exposed Residents**: Uses WorldPop-derived high-resolution population grids to estimate local populations (scaled dynamically under climate scenarios).
  * **Structural Assets**: Uses dynamic OpenStreetMap footprint extractions to estimate local structures inside the active buffer zone (scaled dynamically under climate scenarios).
  * **Exposed Roads Network**: Computes the cumulative length (in km) of roads overlapping the hazard buffer.
  * **Projected Evacuees**: Active only during simulations, this card estimates potential human displacement numbers based on water level intensity coefficients.
  * **Computed Risk Drivers**: Outlines specific structural vulnerabilities (such as low elevation or coastal proximity) that drive risks at the targeted coordinate.
  * **⛰️ Terrain & Slope Intelligence Panel**:
    * **Center Elevation**: Displays precise altitude above sea level (meters ASL) at the targeted center.
    * **Slope Gradient**: Calculates the percentage and degree gradient slope (e.g. flagging steeper zones prone to heavy runoff velocity and flatter basins prone to pooling).
    * **Slope Aspect**: Reports the physical aspect heading (compass direction of descending slope).
    * **Buffer Profile Span**: Summarizes elevation range (Minimum, Maximum, and Mean elevations) within the buffer sphere.
    * **📈 Trans-Section Elevation Spline Chart**: Renders a dynamic, theme-responsive SVG line chart mapping the elevation cross-section from South-West to North-East across the active buffer area, marking the pinpoint center.

* **Generative AI Report Tab**:
  * **Gemini Generative Reasoning**: Delivers a comprehensive scientific and hydrological report utilizing our Gemini RAG pipelines to contextualize local rainfall patterns, active climate scenario stress factors, historic spillway releases, water basins, and local DEM properties (elevation, slope percentage, terrain roughness) to provide tailored risk assessments.

* **Action Plan & Sources Tab**:
  * **Interactive Mitigation Recommendations**: A localized action checklist tailored to the target coordinate (e.g., drainage desiltation, real-time warning sensors) that users can mark complete in real-time.
  * **Data Citations & Attributions**: Full scientific attribution cards detailing original source repositories (e.g., Ghana Hydrological Authority, WorldPop Southampton).

* **Collapsible Map Hazard Legend**:
  * The map's absolute hazard legend is fully collapsible. On mobile devices, it defaults to a compact **Show Legend** button to avoid covering the map viewport, while expanding with a clean animation on click. On desktop displays, it remains expanded by default for immediate lookup.

---

## 🧭 How to Use

The application combines raw geographic calculation with generative text analysis to evaluate flood risk.

1. **Toggle Color Themes**:
   - Locate the theme selection bar inside the top navigation panel.
   - Click the circular **Theme** button to cycle through gorgeous customized styling modes:
     - 🌌 **Midnight**: Slate-based classic theme with sharp violet glows.
     - 🌿 **Emerald**: Warm, biological aesthetic utilizing deep jade palettes.
     - 🎒 **Crimson**: Dark red alert visual style with high contrast warning elements.
     - 🌅 **Amber**: Industrial earth-toned layout with sandy highlights.
   
2. **Set Target Coordinates**:
   - **Click Coordinates Directly**: Move around the Leaflet map and single-click anywhere. The pin will jump to your target and automatically run updated calculations.
   - **Target Regional Presets**: Click any floodplain button under the "Target Ghana Floodplains" list (e.g., *Akosombo Spillway Zone*, *Odaw River Basin*, *Tarkwa Gold Mining Valley*, *Bolgatanga White Volta Plain*) to load its location instantly.
   - **Manual Latitude & Longitude**: Select the **WGS-84** tab and type numeric inputs directly.
   - **Ghana UTM Grid Entry**: Select the **UTM-30N** tab, input the local transverse mercator Northing/Easting coordinates, and click *Convert Grid & Analyze*.

3. **Select Simulated Climate Scenarios**:
   - Locate the **Climate Scenario Simulation** dropdown in the "Vulnerability Controls" card.
   - Select any simulated state (e.g., *Bagre Dam Spillway Release*) to dynamically scale rainfall factors, buffers, and evacuation projections.

4. **Adjust Risk Buffer Range**:
   - Move the slider at the bottom of the control form to specify the hazard exposure radius (ranging from **500m to 10km**).
   
5. **Read Geohazard Metrics**:
   - Dynamic indicators calculated from WorldPop datasets show estimated population numbers, structural asset values, and exposed road configurations within your buffer sphere.
   - Under active simulations, check the **Projected Evacuees** card for human displacement forecasts.
   - Read the structured AI reasoning blocks to review local hydrological history and context.
   - Use the **Mitigation Actions Checklist** to mark recommended safety actions (such as regular desiltation or early evacuation alerts) as complete.

6. **Lookup Nearest Safe Havens & NADMO Directory**:
   - Select the **🏥 Safe Havens & NADMO** tab inside the results panel.
   - Review the calculated top 3 closest certified safe havens, complete with geodesic distances, capacities, regional contacts, and structured route recommendations.
   - Use the built-in search bar in the **NADMO Ghana Directory** panel to find regional offices and click to dial direct hotlines (including national toll-free lines *112* and *193*).

7. **Analyze Temporal Trends & Return Periods**:
   - Open the **📊 Historical Timeline** tab.
   - Adjust the **Geographical Region Filter** or fine-tune the **Temporal boundaries slider** (from 2015 to 2025) to narrow down historical incidents.
   - Hover over the combined Bar and Line Chart (powered by **Recharts**) to explore relative displacement counts alongside verified fatalities.
   - Browse the **Historic Catastrophe Log Registry** cards below the chart and select specific events to load their full dossier (including localized triggers, structural damage, and official sources).

8. **Generate Official Disaster Bulletin (PDF)**:
   - Click the prominent **Download NADMO Bulletin (PDF)** button located inside the primary threat indicator panel.
   - A multi-page high-fidelity PDF is generated directly client-side. The document includes official Republic of Ghana headers, unique serial numbers, location geolocations, elevation profiles, exposure statistics matrices, generative AI hazard breakdowns, certified sanctuary locations with routing instructions, and direct regional dispatcher contact directories.

---

## 🧪 Testing

Confirm typescript compiles correctly and runs evaluation scripts:
```bash
npm run lint
```

---

## 📝 License

This project is open-source and licensed under the MIT License.


