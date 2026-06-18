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
| **`backend/api/routes.ts`** | Handles geographical requests, coordinate bounds, and prompts. Incorporates specific coordinate ranges verification. |
| **`backend/core/geospatial.ts`** | Computes topological math such as population exposure counts on WorldPop dataset estimations, building asset overlaps, and regional road network statistics. |
| **`backend/core/llm_service.ts`** | Feeds zonal metrics with historical reference contexts to Structured Gemini Flash LLM to obtain precise mitigation plans and scientific breakdowns. |
| **`backend/core/rag_retriever.ts`** | Looks up the geographically closest risk-prone physical plane, calculating exact spatial distances and historic notes for inclusion in RAG contexts. |
| **`backend/data/ghana_flood_zones.ts`** | Stores coordinate centroids, risk classifications, and historic hydrological descriptions of major plains (Akwapim, Odaw Basin, Akosombo spillways, etc.) in Ghana. |
| **`frontend/src/App.tsx`** | Coordinates the global theme state selector, layout templates, parameter changes, active coordinates, and user interactiveness. |
| **`frontend/src/components/MapView.tsx`** | Leaflet-centered interactive map. Plots hazard buffer guidelines, target centroids, and listens to user coordinate clicks. |
| **`frontend/src/components/ControlPanel.tsx`** | Custom input component. Includes coordinate toggle cards (WGS-84 coordinate coordinates or UTM-30N Grid meters), target selections, and geographical radius sliders. |
| **`frontend/src/components/ResultsDisplay.tsx`** | Consolidates and renders output results. Houses metrics counters, structural metrics checklists, and collapsible checkboxes for NADMO flood evacuation recommendations. |
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
* **Geographical Presets**: Locate the **Target Ghana Floodplains** panel. Click on top risk hotspots such as the *Odaw River Basin (Accra)*, *Weija Dam Catchment (Ga South)*, *Keta Lagoon Flats*, or the *Akosombo Spillway Zone* to instantly run the analysis.
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

### 3. Interpreting the Assessment Results
Once the calculations complete, the system outputs metrics in the Results section:
* **Vulnerability Evaluation Badge**:
  * Displays a color-coded threat level: `🟢 LOW` (Standard suburban drainage behaviors), `🟡 MEDIUM` (Bordering low-level active hazard profiles), `🟠 HIGH` (Sits within potential flooding reach), or `🔴 CRITICAL` (Directly within active floodplain bounds).
  * Informative descriptions show the distance in kilometers from your pin to the closest pre-defined high-risk zone.
* **Hydrological Elements Exposed**:
  * **Exposed Residents**: Uses WorldPop-derived high-resolution population density grids to estimate the number of people living inside your buffer area.
  * **Structural Assets**: Uses dynamic OpenStreetMap footings to estimate structural assets inside the critical sector.
  * **Exposed Roads Network**: Displays the calculated cumulative length (in km) of roads overlapping the designated risk buffer.
* **Computed Risk Drivers**: Lists key structural vulnerability factors specific to this location (e.g. proximity to critical river systems, elevation factors, historical flood histories).
* **Gemini Generative Reasoning Statement**: Provides a comprehensive scientific assessment written using our RAG pipelines. This blends real-time GIS findings with the historical flood contexts of local rivers and dams.
* **Mitigation Recommendation Action Plan**: A checklist of actions tailored specifically for this zone. You can click on each recommendation to mark it as complete.

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
   - **Target Regional Presets**: Click any floodplain button under the "Target Ghana Floodplains" list (e.g., *Akosombo Spillway Zone*, *Odaw River Basin*, *Weija Dam Catchment*) to load its location instantly.
   - **Manual Latitude & Longitude**: Select the **WGS-84** tab and type numeric inputs directly.
   - **Ghana UTM Grid Entry**: Select the **UTM-30N** tab, input the local transverse mercator Northing/Easting coordinates, and click *Convert Grid & Analyze*.

3. **Adjust Risk Buffer Range**:
   - Move the slider at the bottom of the control form to specify the hazard exposure radius (ranging from **500m to 10km**).
   
4. **Read Geohazard Metrics**:
   - Dynamic indicators calculated from WorldPop datasets show estimated population numbers, structural asset values, and exposed road configurations within your buffer sphere.
   - Read the structured AI reasoning blocks to review local hydrological history and context.
   - Use the **Mitigation Actions Checklist** to mark recommended safety actions (such as regular desiltation or early evacuation alerts) as complete.

---

## 🧪 Testing

Confirm typescript compiles correctly and runs evaluation scripts:
```bash
npm run lint
```

---

## 📝 License

This project is open-source and licensed under the MIT License.
