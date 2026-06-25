import { useState, useEffect } from "react";
import { Globe, Clock, Palette, Menu, X, BookOpen } from "lucide-react";
import {
  GHANA_PRESETS,
  LocationPreset,
  GeospatialStats,
  AiRiskResponse,
  AnalyzeApiResponse,
  CLIMATE_SCENARIOS,
  ClimateScenarioInfo
} from "./types";
import { MapView, ControlPanel, ResultsDisplay } from "./components";
import { utm30NToLatLng, isCoordinateInGhana } from "./utils/geoUtils";

type AppTheme = "midnight" | "emerald" | "crimson" | "amber";

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<AppTheme>("midnight");

  // Primary geographic configuration state
  const [inputMode, setInputMode] = useState<"wgs84" | "utm30n">("wgs84");
  const [latInput, setLatInput] = useState<string>("5.5891");
  const [lngInput, setLngInput] = useState<string>("-0.2145");
  const [utmEasting, setUtmEasting] = useState<string>("255146");
  const [utmNorthing, setUtmNorthing] = useState<string>("617942");

  const [bufferRadius, setBufferRadius] = useState<number>(2000); // meters

  // Active simulated climate scenario ID
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("baseline");

  // Realized state values passed to Map and Services
  const [latitude, setLatitude] = useState<number>(5.5891);
  const [longitude, setLongitude] = useState<number>(-0.2145);

  // Pipeline status and responses
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<GeospatialStats | null>(null);
  const [aiData, setAiData] = useState<AiRiskResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // Checked recommendations UX tracker
  const [checkedRecommendations, setCheckedRecommendations] = useState<Record<number, boolean>>({});

  // Hamburger dropdown & walkthrough guide states
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<number>(1);

  // Reset checked recommendations when ai data updates
  useEffect(() => {
    setCheckedRecommendations({});
  }, [aiData]);

  // Load backend health details on startup
  useEffect(() => {
    fetchHealthStatus();
    // Run initial analysis for Accra Circle confluence under baseline
    handleRunAnalysis(5.5891, -0.2145, 2000, "baseline");
  }, []);


  const fetchHealthStatus = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthStatus(data);
    } catch (e) {
      console.warn("Backend health diagnostics unreachable:", e);
    }
  };

  // Triggers coordinate conversion from Ghana National Grid
  const handleUTMProjection = () => {
    const east = parseFloat(utmEasting);
    const north = parseFloat(utmNorthing);

    if (isNaN(east) || isNaN(north)) {
      setErrorMsg("Easting and Northing values must be valid whole meters.");
      return;
    }

    const transformed = utm30NToLatLng(east, north);
    setLatInput(transformed.lat.toFixed(4).toString());
    setLngInput(transformed.lng.toFixed(4).toString());
    setInputMode("wgs84");

    // Immediately set actual coordinate states
    setLatitude(transformed.lat);
    setLongitude(transformed.lng);
    setErrorMsg(null);

    // Automatically trigger analysis
    handleRunAnalysis(transformed.lat, transformed.lng, bufferRadius);
  };

  const executePipeline = () => {
    setErrorMsg(null);
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setErrorMsg("Invalid Latitude. Must be between -90 and 90.");
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setErrorMsg("Invalid Longitude. Must be between -180 and 180.");
      return;
    }

    setLatitude(lat);
    setLongitude(lng);
    handleRunAnalysis(lat, lng, bufferRadius);
  };

  const handleScenarioChange = (newScenarioId: string) => {
    setSelectedScenarioId(newScenarioId);
    handleRunAnalysis(latitude, longitude, bufferRadius, newScenarioId);
  };

  const handleRunAnalysis = async (lat: number, lng: number, radius: number, scenarioId: string = selectedScenarioId) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          bufferRadius: radius,
          scenarioId
        })
      });

      if (!response.ok) {
        throw new Error("Geospatial calculations failed on backend cluster.");
      }

      const resJson: AnalyzeApiResponse = await response.json();
      if (resJson.success) {
        setStats(resJson.analysis);
        setAiData(resJson.ai);
      } else {
        throw new Error("Internal error executing algorithm.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to contact analysis server.");
    } finally {
      setIsLoading(false);
    }
  };


  // Updates parameters immediately when clicking a preset
  const handlePresetSelect = (preset: LocationPreset) => {
    setLatInput(preset.lat.toString());
    setLngInput(preset.lng.toString());
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setBufferRadius(preset.bufferRadius);
    setInputMode("wgs84");
    handleRunAnalysis(preset.lat, preset.lng, preset.bufferRadius);
  };

  // Relocates target when clicking the Leaflet map
  const handleMapClick = (lat: number, lng: number) => {
    setLatInput(lat.toFixed(4).toString());
    setLngInput(lng.toFixed(4).toString());
    setLatitude(lat);
    setLongitude(lng);
    handleRunAnalysis(lat, lng, bufferRadius);
  };

  // Loop themes
  const toggleTheme = () => {
    const list: AppTheme[] = ["midnight", "emerald", "crimson", "amber"];
    const nextIdx = (list.indexOf(theme) + 1) % list.length;
    setTheme(list[nextIdx]);
  };

  // Theme configuration properties mapper
  const getThemeClasses = (t: AppTheme) => {
    switch (t) {
      case "emerald":
        return {
          bg: "bg-emerald-950/30 text-stone-100",
          navBg: "bg-stone-900/70 border-emerald-900/30",
          cardBg: "bg-emerald-950/20 border-emerald-900/30",
          badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          btnGradient: "from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-950/50",
          btnSecondary: "hover:border-emerald-700/60",
          hoverAccentText: "group-hover:text-emerald-400",
          accentBadge: "group-hover:bg-emerald-950/30 group-hover:border-emerald-800/30 group-hover:text-emerald-400",
          textAccent: "text-emerald-400",
          sliderAccent: "accent-emerald-500",
          themeCircleColor: "bg-emerald-500"
        };
      case "crimson":
        return {
          bg: "bg-slate-950 text-slate-100",
          navBg: "bg-neutral-905/70 border-rose-900/30",
          cardBg: "bg-rose-950/10 border-rose-950/45",
          badgeBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
          btnGradient: "from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-950/50",
          btnSecondary: "hover:border-rose-700/65",
          hoverAccentText: "group-hover:text-rose-400",
          accentBadge: "group-hover:bg-rose-950/30 group-hover:border-rose-850/30 group-hover:text-rose-400",
          textAccent: "text-rose-400",
          sliderAccent: "accent-rose-500",
          themeCircleColor: "bg-rose-500"
        };
      case "amber":
        return {
          bg: "bg-stone-950 text-stone-100",
          navBg: "bg-zinc-905/70 border-amber-900/30",
          cardBg: "bg-amber-950/10 border-amber-950/35",
          badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          btnGradient: "from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-amber-950/50",
          btnSecondary: "hover:border-amber-700/60",
          hoverAccentText: "group-hover:text-amber-400",
          accentBadge: "group-hover:bg-amber-950/30 group-hover:border-amber-800/30 group-hover:text-amber-400",
          textAccent: "text-amber-400",
          sliderAccent: "accent-amber-500",
          themeCircleColor: "bg-amber-500"
        };
      default: // midnight
        return {
          bg: "bg-slate-950 text-slate-100",
          navBg: "bg-slate-900/60 border-slate-800",
          cardBg: "bg-slate-900/80 border-slate-800",
          badgeBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/35",
          btnGradient: "from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 shadow-indigo-900/30",
          btnSecondary: "hover:border-slate-700",
          hoverAccentText: "group-hover:text-indigo-400",
          accentBadge: "group-hover:bg-indigo-950/20 group-hover:border-indigo-800/30 group-hover:text-indigo-400",
          textAccent: "text-indigo-400",
          sliderAccent: "accent-indigo-500",
          themeCircleColor: "bg-indigo-500"
        };
    }
  };

  const tc = getThemeClasses(theme);

  // Risk coloring scheme helper
  const getRiskStyles = (severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined) => {
    switch (severity) {
      case "CRITICAL":
        return {
          bg: "bg-red-950/40 border-red-700/60",
          text: "text-red-400",
          border: "border-red-900/40",
          icon: "🔴"
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/40 border-orange-700/60",
          text: "text-orange-400",
          border: "border-orange-900/40",
          icon: "🟠"
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-950/30 border-yellow-700/40",
          text: "text-yellow-400",
          border: "border-yellow-900/30",
          icon: "🟡"
        };
      default:
        return {
          bg: "bg-emerald-950/30 border-emerald-800/40",
          text: "text-emerald-400",
          border: "border-emerald-900/30",
          icon: "🟢"
        };
    }
  };

  const riskStyle = getRiskStyles(stats?.evaluatedSeverity);

  const toggleRecommendation = (idx: number) => {
    setCheckedRecommendations((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className={`min-h-screen ${tc.bg} font-sans pb-12 transition-colors duration-350`}>
      {/* 🚀 HUD Top-Bar Command Station */}
      <nav className={`border-b ${tc.navBg} backdrop-blur-md sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tc.btnGradient} flex items-center justify-center shadow-md transition-all`}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
                CRISIS GEOSPATIAL ANALYZER
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all ${tc.badgeBg}`}>
                  GHANA HYDRO v1.0
                </span>
              </h1>
              <p className="text-xs text-slate-400">Flood Exposure Intelligence and RAG-based Risk Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* 🎨 Theme Toggler - Circular Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer group shadow-sm"
              title="Toggle system theme"
            >
              <Palette className={`w-3.5 h-3.5 ${tc.textAccent} transition-colors`} />
              <span className="uppercase text-[9px] font-bold tracking-wider">Theme:</span>
              <span className={`w-2 h-2 rounded-full ${tc.themeCircleColor} inline-block shadow`} />
              <span className="capitalize text-[10px]">{theme}</span>
            </button>

            {healthStatus ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>SERVER ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>LOCAL SIMULATOR</span>
              </div>
            )}
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleTimeString()} (GMT)</span>
            </div>

            {/* 🍔 Hamburger menu button with dropdown list */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center p-2 rounded-lg border border-slate-700/60 bg-slate-900/85 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm focus:outline-none"
                title="Open system menu"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {isMenuOpen && (
                <>
                  {/* Backdrop overlay to click away & auto-close */}
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800/80 bg-slate-950 p-2 text-left shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[9px] font-mono tracking-wider text-slate-500 uppercase border-b border-slate-900 mb-1.5">
                      System Metadata
                    </div>
                    <div className="px-3 py-1 text-xs text-slate-300 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      GHANA HYDRO v1.0
                    </div>
                    <div className="my-1.5 border-t border-slate-900" />
                    <button
                      onClick={() => {
                        setIsGuideOpen(true);
                        setIsMenuOpen(false);
                        setGuideStep(1);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-all flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      How to Use Guide
                    </button>
                    <div className="my-1.5 border-t border-slate-900" />
                    <div className="px-3 py-1.5 text-[9px] text-slate-500 leading-normal font-sans">
                      Geospatial calculations and structural estimators are processed client-side with full-stack pipeline integration.
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== LEFT CONTROL COLUMN ==================== */}
          <div className="lg:col-span-4">
            <ControlPanel
              inputMode={inputMode}
              setInputMode={setInputMode}
              latInput={latInput}
              setLatInput={setLatInput}
              lngInput={lngInput}
              setLngInput={setLngInput}
              easting={utmEasting}
              setEasting={setUtmEasting}
              northing={utmNorthing}
              setNorthing={setUtmNorthing}
              bufferRadius={bufferRadius}
              setBufferRadius={setBufferRadius}
              isLoading={isLoading}
              tc={tc}
              onPresetSelect={handlePresetSelect}
              onUTMConvertAndAnalyze={handleUTMProjection}
              onWGSAnalyze={executePipeline}
              selectedScenarioId={selectedScenarioId}
              onScenarioChange={handleScenarioChange}
            />
          </div>


          {/* ==================== CENTER & RIGHT VISUALIZER ==================== */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* 🗺️ Big Interactive Geographic Mapping Canvas */}
            <div className="h-[400px]">
              <MapView
                latitude={latitude}
                longitude={longitude}
                bufferRadiusMeters={bufferRadius}
                stats={stats}
                onMapClick={handleMapClick}
              />
            </div>

            {errorMsg && (
              <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200">
                ⚠️ <b>Execution warning:</b> {errorMsg}
              </div>
            )}

            {/* ================= STATE RESULTS DISPLAY ================= */}
            <ResultsDisplay
              stats={stats}
              aiData={aiData}
              isLoading={isLoading}
              tc={tc}
              riskStyle={riskStyle}
              checkedRecommendations={checkedRecommendations}
              toggleRecommendation={toggleRecommendation}
              theme={theme}
            />

          </div>

        </div>
      </main>

      {/* 📘 Interactive Step-by-Step Walkthrough Assessment Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Transparent click backdrop overlay to close modal */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsGuideOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            
            {/* Header section with titles */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className={`w-4 h-4 ${tc.textAccent}`} />
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-200">
                  Interactive Platform Guide
                </h3>
              </div>
              <button 
                onClick={() => setIsGuideOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-all font-sans cursor-pointer focus:outline-none"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Dynamic Step-tracker badges info and line items timeline */}
            <div className="bg-slate-950 px-5 py-2.5 flex items-center justify-between text-[10px] font-mono border-b border-slate-800/40">
              <span className="text-slate-400">Step {guideStep} of 3</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1.5 rounded transition-all duration-300 ${
                      step === guideStep ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Wizard step specific body panels */}
            <div className="p-6 text-xs min-h-[300px] max-h-[350px] overflow-y-auto space-y-4 text-slate-300">
              {guideStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    📍 1. Inputting Coordinates
                  </h4>
                  <p className="leading-relaxed">
                    Set geographic points within Ghana bounds to calculate physical distances to primary hydrological planes dynamically.
                  </p>
                  <div className="space-y-2 mt-4">
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 leading-relaxed text-[11px]">
                      <strong className="text-slate-200 block mb-0.5">🎮 Interactive Map Click</strong>
                      Position your pointer anywhere on the interactive Leaflet map and mouse-click. Standard GPS coordinates are configured instantly.
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 leading-relaxed text-[11px]">
                      <strong className="text-slate-200 block mb-0.5">📂 Target Ghana Presets</strong>
                      Click predefined hotspots under the presets menu (e.g., Akosombo Spillways, Odaw Plain) to load coordinates directly.
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 leading-relaxed text-[11px]">
                      <strong className="text-slate-200 block mb-0.5">✏️ Manual Input</strong>
                      Input WGS-84 coordinate parameters (Lat/Lng) inside the form fields and fire calculation routines.
                    </div>
                  </div>

                  {/* interactive quick click demo inside the guide */}
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        handlePresetSelect(GHANA_PRESETS[1]); // Odaw River Basin
                        setIsGuideOpen(false);
                      }}
                      className="w-full py-2.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-slate-950 text-indigo-400 font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      ⚡ Try Quick Demo: Load "Odaw River Basin" & Exit
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    🌐 2. Transverse Mercator (UTM-30N) Converter
                  </h4>
                  <p className="leading-relaxed">
                    Convert Ghanaian local survey grid parameters (national grid in meters) directly to generic geographic GPS lat/lng degrees.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-[11px] pl-1 text-slate-300">
                    <li>
                      Toggle the <span className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-200">UTM-30N</span> switch on the Vulnerability Controls panel.
                    </li>
                    <li>
                      Input the local grid metrics in meters in both **Easting (X)** and **Northing (Y)** parameter fields.
                    </li>
                    <li>
                      Click **Convert Grid & Analyze** to execute the projection scripts.
                    </li>
                    <li>
                      The coordinates convert immediately, the map focal pointer pivots, and backend GIS calculators process physical exposures.
                    </li>
                  </ol>

                  {/* UTM Simulation button inside guide */}
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        setUtmEasting("239569");
                        setUtmNorthing("614132");
                        setInputMode("utm30n");
                        const transformed = utm30NToLatLng(239569, 614132);
                        setLatInput(transformed.lat.toFixed(4).toString());
                        setLngInput(transformed.lng.toFixed(4).toString());
                        setInputMode("wgs84");
                        setLatitude(transformed.lat);
                        setLongitude(transformed.lng);
                        handleRunAnalysis(transformed.lat, transformed.lng, bufferRadius);
                        setIsGuideOpen(false);
                      }}
                      className="w-full py-2.5 rounded-lg border border-teal-500/20 bg-teal-500/10 hover:bg-slate-950 text-teal-400 font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      ⚡ Try Quick Demo: Convert "Weija Dam" UTM Coordinates & Exit
                    </button>
                  </div>
                </div>
              )}

              {guideStep === 3 && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    📈 3. Interpreting Assessment Results
                  </h4>
                  <p className="leading-relaxed">
                    Understand the generated outputs from the geospatial algorithms and Gemini reasoning.
                  </p>
                  
                  <div className="space-y-3 mt-4 text-[11px]">
                    <div className="flex gap-2.5 items-start">
                      <span className="text-sm shrink-0">🚨</span>
                      <div>
                        <strong className="text-slate-100 block">Vulnerability Evaluation badge</strong>
                        Displays Threat rating levels from `LOW` to `CRITICAL` indicating exact physical distance offsets to river spillways or catchments.
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-sm shrink-0">🏘️</span>
                      <div>
                        <strong className="text-slate-100 block">Hydrological Elements Exposures</strong>
                        Estimates resident counts computed directly on high-resolution WorldPop population density models and structural asset counts on OpenStreetMap datasets.
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="text-sm shrink-0">🤖</span>
                      <div>
                        <strong className="text-slate-100 block">Gemini RAG Reasoning</strong>
                        Combines topological distance statistics with regional rainfall histories, building buffer zones, and water basins to deliver precise, tailored scientific assessments.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer nav indicators */}
            <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center">
              {guideStep > 1 ? (
                <button 
                  onClick={() => setGuideStep(p => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-semibold text-xs hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}

              {guideStep < 3 ? (
                <button 
                  onClick={() => setGuideStep(p => p + 1)}
                  className={`px-3.5 py-1.5 rounded-lg bg-gradient-to-r ${tc.btnGradient} text-white font-semibold text-xs transition-all cursor-pointer`}
                >
                  Next Step →
                </button>
              ) : (
                <button 
                  onClick={() => setIsGuideOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Finish Guide
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
